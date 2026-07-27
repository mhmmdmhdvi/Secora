from django.db.models import Sum

from learning.models import LearningAchievement, LearningPath, LearningXpEvent, LessonProgress
from lessons.models import Lesson, LessonRevision


XP_RULES = {
    LearningXpEvent.Type.LESSON_STARTED: 2,
    LearningXpEvent.Type.INTERACTIVE_COMPLETED: 10,
    LearningXpEvent.Type.GUIDE_COMPLETED: 5,
    LearningXpEvent.Type.QUIZ_PASSED: 10,
    LearningXpEvent.Type.QUIZ_FIRST_TRY: 5,
    LearningXpEvent.Type.LESSON_COMPLETED: 20,
}

LEVELS = [
    {
        "level": 1,
        "code": "beginnerAnalyst",
        "name": "Beginner Analyst",
        "minimum_xp": 0,
    },
    {
        "level": 2,
        "code": "webSecurityApprentice",
        "name": "Web Security Apprentice",
        "minimum_xp": 100,
    },
    {
        "level": 3,
        "code": "injectionHunter",
        "name": "Injection Hunter",
        "minimum_xp": 250,
    },
    {
        "level": 4,
        "code": "clientSideDefender",
        "name": "Client-Side Defender",
        "minimum_xp": 500,
    },
    {
        "level": 5,
        "code": "secureCodeSpecialist",
        "name": "Secure Code Specialist",
        "minimum_xp": 850,
    },
]

ACHIEVEMENTS = [
    {
        "code": "firstExploit",
        "icon": "zap",
        "category": "interactive",
    },
    {
        "code": "firstGuideRead",
        "icon": "book",
        "category": "guide",
    },
    {
        "code": "firstQuizPassed",
        "icon": "check",
        "category": "quiz",
    },
    {
        "code": "firstPerfectQuiz",
        "icon": "target",
        "category": "quiz",
    },
    {
        "code": "firstLessonCompleted",
        "icon": "award",
        "category": "completion",
    },
    {
        "code": "sqlInjectionCompleted",
        "icon": "shield",
        "category": "completion",
    },
]


def award_lesson_xp(user, lesson, revision, event_type):
    xp_amount = XP_RULES[event_type]
    event, created = LearningXpEvent.objects.get_or_create(
        user=user,
        lesson_slug=lesson.slug,
        event_type=event_type,
        defaults={
            "lesson": lesson,
            "revision": revision,
            "xp_amount": xp_amount,
        },
    )
    return event if created else None


def unlock_achievement(user, code, lesson=None, revision=None):
    achievement, created = LearningAchievement.objects.get_or_create(
        user=user,
        code=code,
        defaults={
            "lesson": lesson,
            "revision": revision,
            "lesson_slug": lesson.slug if lesson else "",
        },
    )
    return achievement if created else None


def build_achievement_profile(user):
    unlocked_by_code = {
        achievement.code: achievement
        for achievement in LearningAchievement.objects.filter(user=user)
    }
    results = []

    for achievement in ACHIEVEMENTS:
        unlocked = unlocked_by_code.get(achievement["code"])
        results.append(
            {
                **achievement,
                "isUnlocked": unlocked is not None,
                "unlockedAt": unlocked.unlocked_at if unlocked else None,
                "lessonSlug": unlocked.lesson_slug if unlocked else "",
            }
        )

    return {
        "unlockedCount": len(unlocked_by_code),
        "totalCount": len(ACHIEVEMENTS),
        "results": results,
    }


def build_learning_paths(user, locale):
    paths = list(
        LearningPath.objects.filter(status=LearningPath.Status.PUBLISHED)
        .prefetch_related(
            "translations",
            "path_lessons__lesson__revisions__translations",
        )
        .order_by("sort_order", "slug")
    )
    lesson_ids = [
        path_lesson.lesson_id
        for path in paths
        for path_lesson in path.path_lessons.all()
    ]
    progress_by_lesson_id = {
        progress.lesson_id: progress
        for progress in LessonProgress.objects.filter(
            user=user,
            lesson_id__in=lesson_ids,
        )
    }

    serialized_paths = [
        serialize_learning_path(path, locale, progress_by_lesson_id)
        for path in paths
    ]
    recommended_path_slug = next(
        (
            serialized_path["slug"]
            for serialized_path in serialized_paths
            if serialized_path["status"] != "completed"
        ),
        serialized_paths[0]["slug"] if serialized_paths else "",
    )

    for serialized_path in serialized_paths:
        serialized_path["isRecommended"] = serialized_path["slug"] == recommended_path_slug

    return {
        "locale": locale,
        "recommendedPathSlug": recommended_path_slug,
        "results": serialized_paths,
    }


def build_recommended_next_lesson(user, locale):
    progress_by_lesson_id = {
        progress.lesson_id: progress
        for progress in LessonProgress.objects.filter(user=user)
    }
    paths = list(
        LearningPath.objects.filter(status=LearningPath.Status.PUBLISHED)
        .prefetch_related(
            "translations",
            "path_lessons__lesson__revisions__translations",
        )
        .order_by("sort_order", "slug")
    )

    for path in paths:
        for path_lesson in path.path_lessons.all():
            progress = progress_by_lesson_id.get(path_lesson.lesson_id)
            if not progress or not progress.lesson_completed_at:
                return serialize_recommendation(
                    lesson=path_lesson.lesson,
                    locale=locale,
                    reason_code="continuePath",
                    path=path,
                )

    completed_lesson_ids = {
        progress.lesson_id
        for progress in progress_by_lesson_id.values()
        if progress.lesson_completed_at
    }
    fallback_lesson = (
        Lesson.objects.filter(
            status=Lesson.Status.PUBLISHED,
            revisions__status=LessonRevision.Status.PUBLISHED,
        )
        .exclude(id__in=completed_lesson_ids)
        .distinct()
        .prefetch_related("revisions__translations")
        .order_by("sort_order", "slug")
        .first()
    )

    if fallback_lesson is None:
        return None

    return serialize_recommendation(
        lesson=fallback_lesson,
        locale=locale,
        reason_code="nextPublished",
    )


def serialize_recommendation(lesson, locale, reason_code, path=None):
    revision = published_revision_for_lesson_object(lesson)
    translation = (
        select_translation(revision.translations.all(), locale)
        if revision is not None
        else MissingTranslation(locale)
    )
    path_translation = select_translation(path.translations.all(), locale) if path else None

    return {
        "reasonCode": reason_code,
        "lesson": {
            "slug": lesson.slug,
            "title": translation.title or lesson.slug,
            "summary": translation.summary,
        },
        "path": (
            {
                "slug": path.slug,
                "title": path_translation.title,
            }
            if path and path_translation
            else None
        ),
    }


def published_revision_for_lesson_object(lesson):
    return next(
        (
            revision
            for revision in lesson.revisions.all()
            if revision.status == LessonRevision.Status.PUBLISHED
        ),
        None,
    )


def serialize_learning_path(path, locale, progress_by_lesson_id):
    translation = select_translation(path.translations.all(), locale)
    path_lessons = list(path.path_lessons.all())
    completed_count = 0
    started_count = 0
    next_lesson = None
    lessons = []

    for index, path_lesson in enumerate(path_lessons):
        lesson = path_lesson.lesson
        progress = progress_by_lesson_id.get(lesson.pk)
        if progress is not None:
            started_count += 1
        is_completed = bool(progress and progress.lesson_completed_at)
        if is_completed:
            completed_count += 1
        elif next_lesson is None:
            next_lesson = path_lesson

        lessons.append(
            serialize_path_lesson(
                path_lesson=path_lesson,
                locale=locale,
                progress=progress,
                is_completed=is_completed,
                is_current=next_lesson == path_lesson,
                is_available=index == 0 or completed_count >= index,
            )
        )

    total_lessons = len(path_lessons)
    progress_percent = 0 if total_lessons == 0 else round((completed_count / total_lessons) * 100)
    current_lesson = next((lesson for lesson in lessons if lesson["isCurrent"]), None)
    path_status = "notStarted"
    if total_lessons > 0 and completed_count == total_lessons:
        path_status = "completed"
    elif started_count > 0 or completed_count > 0:
        path_status = "inProgress"

    return {
        "slug": path.slug,
        "status": path_status,
        "title": translation.title,
        "summary": translation.summary,
        "estimatedMinutes": path.estimated_minutes,
        "completedLessons": completed_count,
        "remainingLessons": max(total_lessons - completed_count, 0),
        "startedLessons": started_count,
        "totalLessons": total_lessons,
        "progressPercent": progress_percent,
        "nextLessonSlug": next_lesson.lesson.slug if next_lesson else "",
        "nextLesson": current_lesson,
        "lessons": lessons,
    }


def serialize_path_lesson(
    path_lesson,
    locale,
    progress,
    is_completed,
    is_current,
    is_available,
):
    lesson = path_lesson.lesson
    revision = next(
        (
            revision
            for revision in lesson.revisions.all()
            if revision.status == "published"
        ),
        None,
    )
    translation = (
        select_translation(revision.translations.all(), locale)
        if revision is not None
        else MissingTranslation(locale)
    )
    status = "locked"
    if is_completed:
        status = "completed"
    elif is_current:
        status = "current"
    elif is_available:
        status = "available"

    return {
        "slug": lesson.slug,
        "title": translation.title or lesson.slug,
        "summary": translation.summary,
        "sortOrder": path_lesson.sort_order,
        "status": status,
        "isCompleted": is_completed,
        "isCurrent": is_current,
        "progress": serialize_path_progress(progress),
    }


def serialize_path_progress(progress):
    if progress is None:
        return None

    return {
        "currentStep": progress.current_step,
        "totalSteps": progress.total_steps,
        "interactiveCompletedAt": progress.interactive_completed_at,
        "guideCompletedAt": progress.guide_completed_at,
        "quizCompletedAt": progress.quiz_completed_at,
        "lessonCompletedAt": progress.lesson_completed_at,
    }


def select_translation(translations, requested_locale):
    translations_by_locale = {translation.locale: translation for translation in translations}
    if requested_locale in translations_by_locale:
        return translations_by_locale[requested_locale]
    if "fa" in translations_by_locale:
        return translations_by_locale["fa"]
    if "en" in translations_by_locale:
        return translations_by_locale["en"]
    if translations_by_locale:
        return next(iter(translations_by_locale.values()))
    return MissingTranslation(requested_locale)


class MissingTranslation:
    title = ""
    summary = ""

    def __init__(self, locale):
        self.locale = locale


def unlock_progress_achievements(progress, event_type):
    if event_type == LearningXpEvent.Type.INTERACTIVE_COMPLETED:
        unlock_achievement(
            progress.user,
            "firstExploit",
            lesson=progress.lesson,
            revision=progress.revision,
        )
    if event_type == LearningXpEvent.Type.GUIDE_COMPLETED:
        unlock_achievement(
            progress.user,
            "firstGuideRead",
            lesson=progress.lesson,
            revision=progress.revision,
        )
    if event_type == LearningXpEvent.Type.LESSON_COMPLETED:
        unlock_lesson_completion_achievements(progress.user, progress.lesson, progress.revision)


def unlock_quiz_achievements(attempt):
    if attempt.passed:
        unlock_achievement(
            attempt.user,
            "firstQuizPassed",
            lesson=attempt.lesson,
            revision=attempt.revision,
        )
        unlock_lesson_completion_achievements(attempt.user, attempt.lesson, attempt.revision)
    if attempt.score == attempt.total_questions:
        unlock_achievement(
            attempt.user,
            "firstPerfectQuiz",
            lesson=attempt.lesson,
            revision=attempt.revision,
        )


def unlock_lesson_completion_achievements(user, lesson, revision):
    unlock_achievement(user, "firstLessonCompleted", lesson=lesson, revision=revision)
    if lesson.slug == "sql-injection":
        unlock_achievement(user, "sqlInjectionCompleted", lesson=lesson, revision=revision)


def build_xp_profile(user):
    total_xp = (
        LearningXpEvent.objects.filter(user=user).aggregate(total=Sum("xp_amount"))[
            "total"
        ]
        or 0
    )
    current_level = level_for_xp(total_xp)
    next_level = next_level_after(current_level)
    next_level_xp = next_level["minimum_xp"] if next_level else current_level["minimum_xp"]
    current_level_xp = current_level["minimum_xp"]
    xp_into_level = total_xp - current_level_xp
    xp_for_next_level = max(next_level_xp - current_level_xp, 0)
    progress_percent = (
        100 if xp_for_next_level == 0 else round((xp_into_level / xp_for_next_level) * 100)
    )

    return {
        "totalXp": total_xp,
        "level": current_level["level"],
        "levelCode": current_level["code"],
        "levelName": current_level["name"],
        "currentLevelXp": current_level_xp,
        "nextLevelXp": next_level_xp,
        "xpIntoLevel": xp_into_level,
        "xpForNextLevel": xp_for_next_level,
        "progressPercent": min(progress_percent, 100),
    }


def level_for_xp(total_xp):
    selected = LEVELS[0]
    for level in LEVELS:
        if total_xp >= level["minimum_xp"]:
            selected = level
        else:
            break
    return selected


def next_level_after(current_level):
    for level in LEVELS:
        if level["level"] > current_level["level"]:
            return level
    return None
