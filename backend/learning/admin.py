from django.contrib import admin

from .models import (
    LearningAchievement,
    LearningPath,
    LearningPathLesson,
    LearningPathTranslation,
    LearningXpEvent,
    LessonBookmark,
    LessonFeedback,
    LessonProgress,
    QuizAttempt,
)


class LearningPathTranslationInline(admin.TabularInline):
    model = LearningPathTranslation
    extra = 0


class LearningPathLessonInline(admin.TabularInline):
    model = LearningPathLesson
    extra = 0
    autocomplete_fields = ("lesson",)
    ordering = ("sort_order",)


@admin.register(LearningPath)
class LearningPathAdmin(admin.ModelAdmin):
    list_display = ("slug", "status", "sort_order", "estimated_minutes", "updated_at")
    list_filter = ("status",)
    search_fields = ("slug", "translations__title")
    inlines = (LearningPathTranslationInline, LearningPathLessonInline)


@admin.register(LessonBookmark)
class LessonBookmarkAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson_slug", "lesson", "created_at")
    list_filter = ("lesson", "created_at")
    search_fields = ("user__username", "user__email", "lesson_slug", "lesson__slug")
    list_select_related = ("user", "lesson")
    readonly_fields = ("created_at",)


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "lesson",
        "revision",
        "current_step",
        "total_steps",
        "lesson_completed_at",
        "last_activity_at",
    )
    list_filter = ("lesson", "lesson_completed_at", "quiz_completed_at")
    search_fields = ("user__username", "user__email", "lesson__slug")
    list_select_related = ("user", "lesson", "revision")
    readonly_fields = ("started_at", "last_activity_at", "updated_at")


@admin.register(LearningXpEvent)
class LearningXpEventAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson_slug", "event_type", "xp_amount", "created_at")
    list_filter = ("event_type", "lesson", "created_at")
    search_fields = ("user__username", "user__email", "lesson_slug")
    list_select_related = ("user", "lesson", "revision")
    readonly_fields = ("created_at",)


@admin.register(LearningAchievement)
class LearningAchievementAdmin(admin.ModelAdmin):
    list_display = ("user", "code", "lesson_slug", "unlocked_at")
    list_filter = ("code", "lesson", "unlocked_at")
    search_fields = ("user__username", "user__email", "code", "lesson_slug")
    list_select_related = ("user", "lesson", "revision")
    readonly_fields = ("unlocked_at",)


@admin.register(LessonFeedback)
class LessonFeedbackAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "lesson",
        "rating",
        "difficulty",
        "source",
        "locale",
        "updated_at",
    )
    list_filter = ("lesson", "rating", "difficulty", "source", "locale", "updated_at")
    search_fields = ("user__username", "user__email", "lesson__slug", "comment")
    list_select_related = ("user", "lesson", "revision")
    readonly_fields = ("created_at", "updated_at")


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "lesson",
        "revision",
        "score",
        "total_questions",
        "passed",
        "completed_at",
    )
    list_filter = ("lesson", "passed", "completed_at")
    search_fields = ("user__username", "user__email", "lesson__slug")
    list_select_related = ("user", "lesson", "revision")
    readonly_fields = ("completed_at",)
