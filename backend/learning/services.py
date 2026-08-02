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

GENERAL_ACHIEVEMENTS = [
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
        "code": "fiveLessonsCompleted",
        "icon": "award",
        "category": "milestone",
    },
    {
        "code": "tenLessonsCompleted",
        "icon": "target",
        "category": "milestone",
    },
    {
        "code": "twentyLessonsCompleted",
        "icon": "shield",
        "category": "milestone",
    },
]

LESSON_ACHIEVEMENTS = [
    {"code": "sqlInjectionCompleted", "lesson_slug": "sql-injection", "icon": "shield", "category": "lesson"},
    {"code": "xssiCompleted", "lesson_slug": "cross-site-script-inclusion", "icon": "code", "category": "lesson"},
    {"code": "storedXssCompleted", "lesson_slug": "cross-site-scripting", "icon": "code", "category": "lesson"},
    {"code": "reflectedXssCompleted", "lesson_slug": "reflected-xss", "icon": "zap", "category": "lesson"},
    {"code": "domXssCompleted", "lesson_slug": "dom-based-xss", "icon": "code", "category": "lesson"},
    {"code": "xxeCompleted", "lesson_slug": "xml-external-entities", "icon": "database", "category": "lesson"},
    {"code": "xmlBombsCompleted", "lesson_slug": "xml-bombs", "icon": "zap", "category": "lesson"},
    {"code": "weakSessionIdsCompleted", "lesson_slug": "weak-session-ids", "icon": "key", "category": "lesson"},
    {"code": "userEnumerationCompleted", "lesson_slug": "user-enumeration", "icon": "search", "category": "lesson"},
    {"code": "unencryptedCommunicationCompleted", "lesson_slug": "unencrypted-communication", "icon": "globe", "category": "lesson"},
    {"code": "toxicDependenciesCompleted", "lesson_slug": "toxic-dependencies", "icon": "package", "category": "lesson"},
    {"code": "subdomainSquattingCompleted", "lesson_slug": "subdomain-squatting", "icon": "globe", "category": "lesson"},
    {"code": "ssrfCompleted", "lesson_slug": "server-side-request-forgery", "icon": "server", "category": "lesson"},
    {"code": "sslStrippingCompleted", "lesson_slug": "ssl-stripping", "icon": "globe", "category": "lesson"},
    {"code": "sessionFixationCompleted", "lesson_slug": "session-fixation", "icon": "key", "category": "lesson"},
    {"code": "remoteCodeExecutionCompleted", "lesson_slug": "remote-code-execution", "icon": "terminal", "category": "lesson"},
    {"code": "regexInjectionCompleted", "lesson_slug": "regex-injection", "icon": "terminal", "category": "lesson"},
    {"code": "prototypePollutionCompleted", "lesson_slug": "prototype-pollution", "icon": "code", "category": "lesson"},
    {"code": "privilegeEscalationCompleted", "lesson_slug": "privilege-escalation", "icon": "shield", "category": "lesson"},
    {"code": "passwordMismanagementCompleted", "lesson_slug": "password-mismanagement", "icon": "key", "category": "lesson"},
    {"code": "openRedirectsCompleted", "lesson_slug": "open-redirects", "icon": "globe", "category": "lesson"},
    {"code": "massAssignmentCompleted", "lesson_slug": "mass-assignment", "icon": "database", "category": "lesson"},
    {"code": "malvertisingCompleted", "lesson_slug": "malvertising", "icon": "zap", "category": "lesson"},
    {"code": "loggingMonitoringCompleted", "lesson_slug": "logging-and-monitoring", "icon": "book", "category": "lesson"},
    {"code": "laxSecuritySettingsCompleted", "lesson_slug": "lax-security-settings", "icon": "shield", "category": "lesson"},
    {"code": "insecureDesignCompleted", "lesson_slug": "insecure-design", "icon": "target", "category": "lesson"},
    {"code": "informationLeakageCompleted", "lesson_slug": "information-leakage", "icon": "database", "category": "lesson"},
    {"code": "hostHeaderPoisoningCompleted", "lesson_slug": "host-header-poisoning", "icon": "server", "category": "lesson"},
    {"code": "fileUploadCompleted", "lesson_slug": "file-upload-vulnerabilities", "icon": "upload", "category": "lesson"},
    {"code": "emailSpoofingCompleted", "lesson_slug": "email-spoofing", "icon": "mail", "category": "lesson"},
    {"code": "downgradeAttacksCompleted", "lesson_slug": "downgrade-attacks", "icon": "globe", "category": "lesson"},
    {"code": "dnsPoisoningCompleted", "lesson_slug": "dns-poisoning", "icon": "globe", "category": "lesson"},
    {"code": "directoryTraversalCompleted", "lesson_slug": "directory-traversal", "icon": "folder", "category": "lesson"},
    {"code": "dosCompleted", "lesson_slug": "denial-of-service-attacks", "icon": "server", "category": "lesson"},
    {"code": "csrfCompleted", "lesson_slug": "cross-site-request-forgery", "icon": "shield", "category": "lesson"},
    {"code": "commandExecutionCompleted", "lesson_slug": "command-execution", "icon": "terminal", "category": "lesson"},
    {"code": "clickjackingCompleted", "lesson_slug": "clickjacking", "icon": "target", "category": "lesson"},
    {"code": "bufferOverflowsCompleted", "lesson_slug": "buffer-overflows", "icon": "server", "category": "lesson"},
    {"code": "brokenAccessControlCompleted", "lesson_slug": "broken-access-control", "icon": "shield", "category": "lesson"},
    {"code": "aiPromptInjectionCompleted", "lesson_slug": "ai-prompt-injection", "icon": "cpu", "category": "lesson"},
    {"code": "aiDataExtractionCompleted", "lesson_slug": "ai-data-extraction-attacks", "icon": "database", "category": "lesson"},
    {"code": "aiBiasCompleted", "lesson_slug": "ai-bias-and-unreliability", "icon": "cpu", "category": "lesson"},
]

ACHIEVEMENTS = [
    *GENERAL_ACHIEVEMENTS,
    *LESSON_ACHIEVEMENTS,
]

LESSON_ACHIEVEMENTS_BY_SLUG = {
    achievement["lesson_slug"]: achievement for achievement in LESSON_ACHIEVEMENTS
}

LESSON_COMPLETION_MILESTONES = [
    (5, "fiveLessonsCompleted"),
    (10, "tenLessonsCompleted"),
    (20, "twentyLessonsCompleted"),
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
    published_lesson_slugs = set(
        Lesson.objects.filter(
            status=Lesson.Status.PUBLISHED,
            revisions__status=LessonRevision.Status.PUBLISHED,
        )
        .distinct()
        .values_list("slug", flat=True)
    )
    results = []

    for achievement in ACHIEVEMENTS:
        lesson_slug = achievement.get("lesson_slug", "")
        is_available = not lesson_slug or lesson_slug in published_lesson_slugs
        unlocked = unlocked_by_code.get(achievement["code"])
        is_unlocked = unlocked is not None and is_available
        results.append(
            {
                **achievement,
                "isAvailable": is_available,
                "isUnlocked": is_unlocked,
                "unlockedAt": unlocked.unlocked_at if is_unlocked else None,
                "lessonSlug": lesson_slug or (unlocked.lesson_slug if unlocked else ""),
                "lockReason": "" if is_available else "lessonComingSoon",
            }
        )

    return {
        "unlockedCount": sum(1 for achievement in results if achievement["isUnlocked"]),
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
    unlocked = []

    if event_type == LearningXpEvent.Type.INTERACTIVE_COMPLETED:
        achievement = unlock_achievement(
            progress.user,
            "firstExploit",
            lesson=progress.lesson,
            revision=progress.revision,
        )
        if achievement:
            unlocked.append(achievement)
    if event_type == LearningXpEvent.Type.GUIDE_COMPLETED:
        achievement = unlock_achievement(
            progress.user,
            "firstGuideRead",
            lesson=progress.lesson,
            revision=progress.revision,
        )
        if achievement:
            unlocked.append(achievement)
    if event_type == LearningXpEvent.Type.LESSON_COMPLETED:
        unlocked.extend(
            unlock_lesson_completion_achievements(
                progress.user,
                progress.lesson,
                progress.revision,
            )
        )

    return unlocked


def unlock_quiz_achievements(attempt):
    unlocked = []

    if attempt.passed:
        achievement = unlock_achievement(
            attempt.user,
            "firstQuizPassed",
            lesson=attempt.lesson,
            revision=attempt.revision,
        )
        if achievement:
            unlocked.append(achievement)
        unlocked.extend(
            unlock_lesson_completion_achievements(
                attempt.user,
                attempt.lesson,
                attempt.revision,
            )
        )
    if attempt.score == attempt.total_questions:
        achievement = unlock_achievement(
            attempt.user,
            "firstPerfectQuiz",
            lesson=attempt.lesson,
            revision=attempt.revision,
        )
        if achievement:
            unlocked.append(achievement)

    return unlocked


def unlock_lesson_completion_achievements(user, lesson, revision):
    unlocked = []
    achievement = unlock_achievement(
        user,
        "firstLessonCompleted",
        lesson=lesson,
        revision=revision,
    )
    if achievement:
        unlocked.append(achievement)

    lesson_achievement = LESSON_ACHIEVEMENTS_BY_SLUG.get(lesson.slug)
    if lesson_achievement:
        achievement = unlock_achievement(
            user,
            lesson_achievement["code"],
            lesson=lesson,
            revision=revision,
        )
        if achievement:
            unlocked.append(achievement)

    completed_count = completed_lesson_count_including(user, lesson)
    for threshold, code in LESSON_COMPLETION_MILESTONES:
        if completed_count >= threshold:
            achievement = unlock_achievement(user, code)
            if achievement:
                unlocked.append(achievement)

    return unlocked


def completed_lesson_count_including(user, lesson):
    completed_slugs = set(
        LessonProgress.objects.filter(
            user=user,
            lesson_completed_at__isnull=False,
        ).values_list("lesson__slug", flat=True)
    )
    completed_slugs.add(lesson.slug)
    return len(completed_slugs)


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
