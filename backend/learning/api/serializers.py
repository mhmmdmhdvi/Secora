from rest_framework import serializers

from learning.models import LessonBookmark, LessonFeedback, LessonProgress, QuizAttempt


class LessonProgressUpdateSerializer(serializers.Serializer):
    currentStep = serializers.IntegerField(min_value=0, required=False)
    totalSteps = serializers.IntegerField(min_value=1, required=False)
    interactiveCompleted = serializers.BooleanField(required=False)
    guideCompleted = serializers.BooleanField(required=False)
    quizCompleted = serializers.BooleanField(required=False)
    lessonCompleted = serializers.BooleanField(required=False)

    def validate(self, attrs):
        current_step = attrs.get("currentStep")
        total_steps = attrs.get("totalSteps")

        if current_step is not None and total_steps is not None and current_step > total_steps:
            raise serializers.ValidationError(
                {"currentStep": "Current step cannot be greater than total steps."}
            )

        return attrs


class QuizAttemptCreateSerializer(serializers.Serializer):
    score = serializers.IntegerField(min_value=0)
    totalQuestions = serializers.IntegerField(min_value=1)
    answers = serializers.JSONField(required=False)

    def validate(self, attrs):
        if attrs["score"] > attrs["totalQuestions"]:
            raise serializers.ValidationError(
                {"score": "Score cannot be greater than total questions."}
            )
        return attrs


class LessonFeedbackCreateSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    difficulty = serializers.ChoiceField(
        choices=LessonFeedback.Difficulty.choices,
        default=LessonFeedback.Difficulty.JUST_RIGHT,
    )
    comment = serializers.CharField(
        allow_blank=True,
        max_length=1000,
        required=False,
        trim_whitespace=True,
    )
    source = serializers.ChoiceField(
        choices=LessonFeedback.Source.choices,
        default=LessonFeedback.Source.QUIZ,
    )


class LocaleQuerySerializer(serializers.Serializer):
    locale = serializers.CharField(
        required=False,
        allow_blank=True,
        default="fa",
        max_length=10,
    )

    def validate_locale(self, value):
        return value or "fa"


def serialize_bookmark(bookmark):
    return {
        "lessonSlug": bookmark.lesson_slug,
        "createdAt": bookmark.created_at,
    }


def serialize_achievement_profile(profile):
    return profile


def serialize_recommendation(recommendation):
    return recommendation


def serialize_bookmarks(bookmarks):
    return {
        "results": [serialize_bookmark(bookmark) for bookmark in bookmarks],
    }


def serialize_catalog_progress(progress_items):
    return {
        "results": [
            {
                "lessonSlug": progress.lesson.slug,
                "status": progress_status(progress),
                "currentStep": progress.current_step,
                "totalSteps": progress.total_steps,
                "lessonCompletedAt": progress.lesson_completed_at,
                "bestQuizScore": progress.best_quiz_score,
                "bestQuizTotal": progress.best_quiz_total,
                "lastActivityAt": progress.last_activity_at,
            }
            for progress in progress_items
        ]
    }


def serialize_feedback(feedback):
    return {
        "id": feedback.pk,
        "lessonSlug": feedback.lesson.slug,
        "revision": {
            "id": feedback.revision_id,
            "version": feedback.revision.version,
            "status": feedback.revision.status,
        },
        "rating": feedback.rating,
        "difficulty": feedback.difficulty,
        "comment": feedback.comment,
        "source": feedback.source,
        "locale": feedback.locale,
        "createdAt": feedback.created_at,
        "updatedAt": feedback.updated_at,
    }


def serialize_progress(progress):
    return {
        "lessonSlug": progress.lesson.slug,
        "revision": {
            "id": progress.revision_id,
            "version": progress.revision.version,
            "status": progress.revision.status,
        },
        "currentStep": progress.current_step,
        "totalSteps": progress.total_steps,
        "interactiveCompletedAt": progress.interactive_completed_at,
        "guideCompletedAt": progress.guide_completed_at,
        "quizCompletedAt": progress.quiz_completed_at,
        "lessonCompletedAt": progress.lesson_completed_at,
        "bestQuizScore": progress.best_quiz_score,
        "bestQuizTotal": progress.best_quiz_total,
        "startedAt": progress.started_at,
        "lastActivityAt": progress.last_activity_at,
        "updatedAt": progress.updated_at,
    }


def progress_status(progress):
    if progress.lesson_completed_at:
        return "completed"
    return "inProgress"


def serialize_xp_profile(profile):
    return profile


def serialize_quiz_attempt(attempt):
    return {
        "id": attempt.pk,
        "lessonSlug": attempt.lesson.slug,
        "revision": {
            "id": attempt.revision_id,
            "version": attempt.revision.version,
            "status": attempt.revision.status,
        },
        "score": attempt.score,
        "totalQuestions": attempt.total_questions,
        "passed": attempt.passed,
        "answers": attempt.answers,
        "startedAt": attempt.started_at,
        "completedAt": attempt.completed_at,
    }
