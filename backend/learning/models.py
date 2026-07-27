from django.conf import settings
from django.db import models
from django.db.models import Q
from django.utils import timezone

from lessons.models import Lesson, LessonRevision
from lessons.validators import validate_locale


class LearningPath(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    slug = models.SlugField(max_length=120, unique=True)
    status = models.CharField(max_length=16, choices=Status, default=Status.DRAFT)
    sort_order = models.PositiveIntegerField(unique=True)
    estimated_minutes = models.PositiveSmallIntegerField(default=45)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("sort_order", "slug")
        indexes = [
            models.Index(fields=("status", "sort_order"), name="path_catalog_idx"),
        ]

    def __str__(self):
        return self.slug


class LearningPathTranslation(models.Model):
    path = models.ForeignKey(
        LearningPath,
        on_delete=models.CASCADE,
        related_name="translations",
    )
    locale = models.CharField(max_length=10, validators=[validate_locale])
    title = models.CharField(max_length=200)
    summary = models.TextField()

    class Meta:
        ordering = ("path", "locale")
        constraints = [
            models.UniqueConstraint(
                fields=("path", "locale"),
                name="unique_learning_path_locale",
            )
        ]

    def __str__(self):
        return f"{self.path.slug} [{self.locale}]"


class LearningPathLesson(models.Model):
    path = models.ForeignKey(
        LearningPath,
        on_delete=models.CASCADE,
        related_name="path_lessons",
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.PROTECT,
        related_name="learning_path_links",
    )
    sort_order = models.PositiveSmallIntegerField()

    class Meta:
        ordering = ("sort_order", "id")
        constraints = [
            models.UniqueConstraint(
                fields=("path", "lesson"),
                name="unique_learning_path_lesson",
            ),
            models.UniqueConstraint(
                fields=("path", "sort_order"),
                name="unique_learning_path_lesson_order",
            ),
        ]

    def __str__(self):
        return f"{self.path.slug}: {self.lesson.slug}"


class LessonBookmark(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lesson_bookmarks",
    )
    lesson = models.ForeignKey(
        Lesson,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="bookmarked_by",
    )
    lesson_slug = models.SlugField(max_length=120)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ("-created_at", "-id")
        constraints = [
            models.UniqueConstraint(
                fields=("user", "lesson_slug"),
                name="unique_user_lesson_bookmark",
            )
        ]
        indexes = [
            models.Index(fields=("user", "-created_at"), name="bookmark_recent_idx"),
            models.Index(fields=("lesson_slug", "-created_at"), name="bookmark_lesson_slug_idx"),
        ]

    def __str__(self):
        return f"{self.user} saved {self.lesson_slug}"


class LessonProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lesson_progress",
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="learner_progress",
    )
    revision = models.ForeignKey(
        LessonRevision,
        on_delete=models.PROTECT,
        related_name="learner_progress",
    )
    current_step = models.PositiveSmallIntegerField(default=0)
    total_steps = models.PositiveSmallIntegerField(null=True, blank=True)
    interactive_completed_at = models.DateTimeField(null=True, blank=True)
    guide_completed_at = models.DateTimeField(null=True, blank=True)
    quiz_completed_at = models.DateTimeField(null=True, blank=True)
    lesson_completed_at = models.DateTimeField(null=True, blank=True)
    best_quiz_score = models.PositiveSmallIntegerField(default=0)
    best_quiz_total = models.PositiveSmallIntegerField(default=0)
    started_at = models.DateTimeField(default=timezone.now)
    last_activity_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-last_activity_at", "-updated_at")
        constraints = [
            models.UniqueConstraint(
                fields=("user", "lesson"),
                name="unique_user_lesson_progress",
            ),
            models.CheckConstraint(
                condition=Q(total_steps__isnull=True) | Q(current_step__lte=models.F("total_steps")),
                name="progress_current_step_lte_total_steps",
            ),
            models.CheckConstraint(
                condition=Q(best_quiz_score__lte=models.F("best_quiz_total"))
                | Q(best_quiz_total=0),
                name="progress_best_score_lte_total",
            ),
        ]
        indexes = [
            models.Index(fields=("user", "-last_activity_at"), name="progress_recent_idx"),
            models.Index(fields=("lesson", "revision"), name="progress_lesson_rev_idx"),
        ]

    def __str__(self):
        return f"{self.user} -> {self.lesson.slug}"

    def touch(self):
        self.last_activity_at = timezone.now()

    def update_best_quiz_score(self, score, total):
        if total <= 0:
            return
        if self.best_quiz_total == 0 or score / total >= self.best_quiz_score / self.best_quiz_total:
            self.best_quiz_score = score
            self.best_quiz_total = total


class LearningXpEvent(models.Model):
    class Type(models.TextChoices):
        LESSON_STARTED = "lesson_started", "Lesson started"
        INTERACTIVE_COMPLETED = "interactive_completed", "Interactive completed"
        GUIDE_COMPLETED = "guide_completed", "Guide completed"
        QUIZ_PASSED = "quiz_passed", "Quiz passed"
        QUIZ_FIRST_TRY = "quiz_first_try", "Quiz first try"
        LESSON_COMPLETED = "lesson_completed", "Lesson completed"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="learning_xp_events",
    )
    lesson = models.ForeignKey(
        Lesson,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="xp_events",
    )
    revision = models.ForeignKey(
        LessonRevision,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="xp_events",
    )
    lesson_slug = models.SlugField(max_length=120)
    event_type = models.CharField(max_length=32, choices=Type)
    xp_amount = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ("-created_at", "-id")
        constraints = [
            models.UniqueConstraint(
                fields=("user", "lesson_slug", "event_type"),
                name="unique_user_lesson_xp_event",
            ),
            models.CheckConstraint(
                condition=Q(xp_amount__gt=0),
                name="xp_event_amount_gt_zero",
            ),
        ]
        indexes = [
            models.Index(fields=("user", "-created_at"), name="xp_event_recent_idx"),
            models.Index(fields=("user", "lesson_slug"), name="xp_event_user_lesson_idx"),
        ]

    def __str__(self):
        return f"{self.user} +{self.xp_amount} XP for {self.event_type}"


class LearningAchievement(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="learning_achievements",
    )
    code = models.SlugField(max_length=80)
    lesson = models.ForeignKey(
        Lesson,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="achievement_unlocks",
    )
    revision = models.ForeignKey(
        LessonRevision,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="achievement_unlocks",
    )
    lesson_slug = models.SlugField(max_length=120, blank=True)
    unlocked_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ("-unlocked_at", "-id")
        constraints = [
            models.UniqueConstraint(
                fields=("user", "code"),
                name="unique_user_learning_achievement",
            )
        ]
        indexes = [
            models.Index(fields=("user", "-unlocked_at"), name="achievement_recent_idx"),
            models.Index(fields=("code", "-unlocked_at"), name="achievement_code_idx"),
        ]

    def __str__(self):
        return f"{self.user} unlocked {self.code}"


class LessonFeedback(models.Model):
    class Difficulty(models.TextChoices):
        TOO_EASY = "too_easy", "Too easy"
        JUST_RIGHT = "just_right", "Just right"
        TOO_HARD = "too_hard", "Too hard"

    class Source(models.TextChoices):
        QUIZ = "quiz", "Quiz"
        GUIDE = "guide", "Guide"
        LESSON = "lesson", "Lesson"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lesson_feedback",
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="feedback",
    )
    revision = models.ForeignKey(
        LessonRevision,
        on_delete=models.PROTECT,
        related_name="feedback",
    )
    rating = models.PositiveSmallIntegerField()
    difficulty = models.CharField(
        max_length=16,
        choices=Difficulty,
        default=Difficulty.JUST_RIGHT,
    )
    comment = models.TextField(blank=True)
    source = models.CharField(max_length=16, choices=Source, default=Source.QUIZ)
    locale = models.CharField(max_length=10, validators=[validate_locale], default="fa")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-updated_at", "-id")
        constraints = [
            models.UniqueConstraint(
                fields=("user", "lesson"),
                name="unique_user_lesson_feedback",
            ),
            models.CheckConstraint(
                condition=Q(rating__gte=1) & Q(rating__lte=5),
                name="feedback_rating_between_1_and_5",
            ),
        ]
        indexes = [
            models.Index(fields=("lesson", "-updated_at"), name="feedback_lesson_recent_idx"),
            models.Index(fields=("user", "-updated_at"), name="feedback_user_recent_idx"),
            models.Index(fields=("rating", "difficulty"), name="feedback_quality_idx"),
        ]

    def __str__(self):
        return f"{self.user} rated {self.lesson.slug}: {self.rating}/5"


class QuizAttempt(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="quiz_attempts",
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="quiz_attempts",
    )
    revision = models.ForeignKey(
        LessonRevision,
        on_delete=models.PROTECT,
        related_name="quiz_attempts",
    )
    score = models.PositiveSmallIntegerField()
    total_questions = models.PositiveSmallIntegerField()
    passed = models.BooleanField(default=False)
    answers = models.JSONField(default=dict, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ("-completed_at", "-id")
        constraints = [
            models.CheckConstraint(
                condition=Q(total_questions__gt=0),
                name="quiz_attempt_total_questions_gt_zero",
            ),
            models.CheckConstraint(
                condition=Q(score__lte=models.F("total_questions")),
                name="quiz_attempt_score_lte_total",
            ),
        ]
        indexes = [
            models.Index(fields=("user", "-completed_at"), name="quiz_attempt_recent_idx"),
            models.Index(fields=("lesson", "revision"), name="quiz_attempt_lesson_rev_idx"),
        ]

    def __str__(self):
        return f"{self.user} -> {self.lesson.slug}: {self.score}/{self.total_questions}"
