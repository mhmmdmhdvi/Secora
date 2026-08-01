from math import ceil

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView

from learning.models import (
    LearningXpEvent,
    LessonBookmark,
    LessonFeedback,
    LessonProgress,
    QuizAttempt,
)
from learning.services import (
    award_lesson_xp,
    build_achievement_profile,
    build_learning_paths,
    build_recommended_next_lesson,
    build_xp_profile,
    unlock_progress_achievements,
    unlock_quiz_achievements,
)
from lessons.models import Lesson, LessonRevision

from .serializers import (
    LocaleQuerySerializer,
    LessonFeedbackCreateSerializer,
    LessonProgressUpdateSerializer,
    QuizAttemptCreateSerializer,
    serialize_achievement_profile,
    serialize_bookmark,
    serialize_bookmarks,
    serialize_catalog_progress,
    serialize_feedback,
    serialize_progress,
    serialize_quiz_attempt,
    serialize_recommendation,
    serialize_reward_summary,
    serialize_xp_profile,
)


class RecommendedNextLessonView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        locale = validated_locale(request)
        return Response(
            {
                "recommendation": serialize_recommendation(
                    build_recommended_next_lesson(request.user, locale)
                )
            }
        )


class LearningPathListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(build_learning_paths(request.user, validated_locale(request)))


class LearningAchievementListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            serialize_achievement_profile(build_achievement_profile(request.user))
        )


class LearningXpProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(serialize_xp_profile(build_xp_profile(request.user)))


class LessonBookmarkListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookmarks = LessonBookmark.objects.select_related("lesson").filter(
            user=request.user
        )
        return Response(serialize_bookmarks(bookmarks))


class LessonBookmarkDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        lesson = lesson_for_slug(slug)
        bookmark, created = LessonBookmark.objects.update_or_create(
            user=request.user,
            lesson_slug=slug,
            defaults={"lesson": lesson},
        )
        return Response(serialize_bookmark(bookmark), status=201 if created else 200)

    def delete(self, request, slug):
        LessonBookmark.objects.filter(user=request.user, lesson_slug=slug).delete()
        return Response(status=204)


class LessonCatalogProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress_items = LessonProgress.objects.select_related("lesson").filter(
            user=request.user,
            lesson__status=Lesson.Status.PUBLISHED,
        )
        return Response(serialize_catalog_progress(progress_items))


class LessonFeedbackDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        serializer = LessonFeedbackCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        revision = published_revision_for_lesson(slug)
        locale = validated_locale(request)

        feedback, created = LessonFeedback.objects.update_or_create(
            user=request.user,
            lesson=revision.lesson,
            defaults={
                "revision": revision,
                "rating": serializer.validated_data["rating"],
                "difficulty": serializer.validated_data["difficulty"],
                "comment": serializer.validated_data.get("comment", ""),
                "source": serializer.validated_data["source"],
                "locale": locale,
            },
        )

        return Response(serialize_feedback(feedback), status=201 if created else 200)


class LessonProgressDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        previous_xp = build_xp_profile(request.user)
        progress = get_or_create_progress(request.user, slug)
        current_xp = build_xp_profile(request.user)
        xp_awarded = max(
            current_xp.get("totalXp", 0) - previous_xp.get("totalXp", 0),
            0,
        )

        return Response(
            serialize_progress(progress)
            | {
                "xp": current_xp,
                "rewards": serialize_reward_summary(
                    previous_xp=previous_xp,
                    current_xp=current_xp,
                    xp_events=[],
                    achievements=[],
                    xp_awarded=xp_awarded,
                ),
            }
        )

    def patch(self, request, slug):
        serializer = LessonProgressUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        previous_xp = build_xp_profile(request.user)

        with transaction.atomic():
            progress = get_or_create_progress(request.user, slug, lock=True)
            reward_result = apply_progress_update(progress, serializer.validated_data)
            progress.touch()
            progress.save()

        current_xp = build_xp_profile(request.user)

        return Response(
            serialize_progress(progress)
            | {
                "achievements": build_achievement_profile(request.user),
                "xp": current_xp,
                "xpAwarded": sum(
                    event.xp_amount for event in reward_result["xp_events"]
                ),
                "rewards": serialize_reward_summary(
                    previous_xp=previous_xp,
                    current_xp=current_xp,
                    xp_events=reward_result["xp_events"],
                    achievements=reward_result["achievements"],
                ),
            }
        )


class QuizAttemptCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        serializer = QuizAttemptCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        locale = validated_locale(request)
        revision = published_revision_for_lesson(slug)
        passed = quiz_passed(revision, data["score"], data["totalQuestions"])
        previous_xp = build_xp_profile(request.user)

        with transaction.atomic():
            xp_events = []
            unlocked_achievements = []
            first_attempt = not QuizAttempt.objects.filter(
                user=request.user,
                lesson=revision.lesson,
            ).exists()
            attempt = QuizAttempt.objects.create(
                user=request.user,
                lesson=revision.lesson,
                revision=revision,
                score=data["score"],
                total_questions=data["totalQuestions"],
                passed=passed,
                answers=data.get("answers", {}),
            )
            progress = get_or_create_progress_for_revision(request.user, revision, lock=True)
            progress.update_best_quiz_score(attempt.score, attempt.total_questions)
            progress.quiz_completed_at = attempt.completed_at
            if passed:
                progress.lesson_completed_at = progress.lesson_completed_at or attempt.completed_at
                xp_events.append(award_lesson_xp(
                    request.user,
                    revision.lesson,
                    revision,
                    LearningXpEvent.Type.QUIZ_PASSED,
                ))
                if first_attempt:
                    xp_events.append(award_lesson_xp(
                        request.user,
                        revision.lesson,
                        revision,
                        LearningXpEvent.Type.QUIZ_FIRST_TRY,
                    ))
                xp_events.append(award_lesson_xp(
                    request.user,
                    revision.lesson,
                    revision,
                    LearningXpEvent.Type.LESSON_COMPLETED,
                ))
                unlocked_achievements.extend(unlock_quiz_achievements(attempt))
            progress.touch()
            progress.save()

        current_xp = build_xp_profile(request.user)

        return Response(
            {
                "attempt": serialize_quiz_attempt(attempt),
                "achievements": build_achievement_profile(request.user),
                "progress": serialize_progress(progress),
                "recommendation": build_recommended_next_lesson(
                    request.user,
                    locale,
                )
                if passed
                else None,
                "xp": current_xp,
                "xpAwarded": sum(event.xp_amount for event in xp_events if event),
                "rewards": serialize_reward_summary(
                    previous_xp=previous_xp,
                    current_xp=current_xp,
                    xp_events=xp_events,
                    achievements=unlocked_achievements,
                ),
            },
            status=201,
        )


def apply_progress_update(progress, data):
    now = timezone.now()
    award_events = []
    unlocked_achievements = []
    current_step = data.get("currentStep", progress.current_step)
    total_steps = data.get("totalSteps", progress.total_steps)

    if total_steps is not None and current_step > total_steps:
        raise ValidationError(
            {"currentStep": "Current step cannot be greater than total steps."}
        )

    if "currentStep" in data:
        progress.current_step = data["currentStep"]
    if "totalSteps" in data:
        progress.total_steps = data["totalSteps"]
    if data.get("interactiveCompleted"):
        if progress.interactive_completed_at is None:
            progress.interactive_completed_at = now
            award_events.append(
                award_lesson_xp(
                    progress.user,
                    progress.lesson,
                    progress.revision,
                    LearningXpEvent.Type.INTERACTIVE_COMPLETED,
                )
            )
            unlocked_achievements.extend(
                unlock_progress_achievements(
                    progress,
                    LearningXpEvent.Type.INTERACTIVE_COMPLETED,
                )
            )
    if data.get("guideCompleted"):
        if progress.guide_completed_at is None:
            progress.guide_completed_at = now
            award_events.append(
                award_lesson_xp(
                    progress.user,
                    progress.lesson,
                    progress.revision,
                    LearningXpEvent.Type.GUIDE_COMPLETED,
                )
            )
            unlocked_achievements.extend(
                unlock_progress_achievements(
                    progress,
                    LearningXpEvent.Type.GUIDE_COMPLETED,
                )
            )
    if data.get("quizCompleted"):
        progress.quiz_completed_at = progress.quiz_completed_at or now
    if data.get("lessonCompleted"):
        if progress.lesson_completed_at is None:
            progress.lesson_completed_at = now
            award_events.append(
                award_lesson_xp(
                    progress.user,
                    progress.lesson,
                    progress.revision,
                    LearningXpEvent.Type.LESSON_COMPLETED,
                )
            )
            unlocked_achievements.extend(
                unlock_progress_achievements(
                    progress,
                    LearningXpEvent.Type.LESSON_COMPLETED,
                )
            )

    return {
        "xp_events": [event for event in award_events if event is not None],
        "achievements": unlocked_achievements,
    }


def validated_locale(request):
    serializer = LocaleQuerySerializer(data=request.query_params)
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data["locale"]


def get_or_create_progress(user, slug, lock=False):
    revision = published_revision_for_lesson(slug)
    return get_or_create_progress_for_revision(user, revision, lock=lock)


def get_or_create_progress_for_revision(user, revision, lock=False):
    queryset = LessonProgress.objects.select_related("lesson", "revision")
    if lock:
        queryset = queryset.select_for_update()

    progress, created = queryset.get_or_create(
        user=user,
        lesson=revision.lesson,
        defaults={"revision": revision},
    )
    if created:
        award_lesson_xp(
            user,
            revision.lesson,
            revision,
            LearningXpEvent.Type.LESSON_STARTED,
        )

    if progress.revision_id != revision.pk:
        progress.revision = revision
        progress.save(update_fields=("revision", "updated_at"))

    return progress


def published_revision_for_lesson(slug):
    return get_object_or_404(
        LessonRevision.objects.select_related("lesson", "quiz").filter(
            lesson__slug=slug,
            lesson__status=Lesson.Status.PUBLISHED,
            status=LessonRevision.Status.PUBLISHED,
        )
    )


def lesson_for_slug(slug):
    return Lesson.objects.filter(slug=slug).first()


def quiz_passed(revision, score, total_questions):
    quiz = getattr(revision, "quiz", None)
    pass_percentage = quiz.pass_percentage if quiz is not None else 100
    return score >= ceil((total_questions * pass_percentage) / 100)
