from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Q

from .validators import validate_block_config, validate_locale, validate_registry_key


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TranslationStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    REVIEW = "review", "In review"
    READY = "ready", "Ready"


class Lesson(TimestampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    class Difficulty(models.TextChoices):
        BEGINNER = "beginner", "Beginner"
        INTERMEDIATE = "intermediate", "Intermediate"
        ADVANCED = "advanced", "Advanced"

    slug = models.SlugField(max_length=120, unique=True)
    status = models.CharField(max_length=16, choices=Status, default=Status.DRAFT)
    difficulty = models.CharField(max_length=16, choices=Difficulty)
    sort_order = models.PositiveIntegerField(unique=True)
    estimated_minutes = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(1440)]
    )
    simulation_key = models.CharField(
        max_length=100, blank=True, validators=[validate_registry_key]
    )
    prerequisites = models.ManyToManyField(
        "self",
        through="LessonPrerequisite",
        symmetrical=False,
        related_name="unlocks",
        blank=True,
    )

    class Meta:
        ordering = ("sort_order", "slug")
        indexes = [models.Index(fields=("status", "sort_order"), name="lesson_catalog_idx")]

    def __str__(self):
        return self.slug


class LessonPrerequisite(models.Model):
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name="prerequisite_links"
    )
    prerequisite = models.ForeignKey(
        Lesson, on_delete=models.PROTECT, related_name="dependent_links"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("lesson", "prerequisite"), name="unique_lesson_prerequisite"
            ),
            models.CheckConstraint(
                condition=~Q(lesson=models.F("prerequisite")),
                name="lesson_cannot_require_itself",
            ),
        ]

    def __str__(self):
        return f"{self.lesson} requires {self.prerequisite}"


class LessonRevision(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        RETIRED = "retired", "Retired"

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="revisions")
    version = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    status = models.CharField(max_length=16, choices=Status, default=Status.DRAFT)
    change_summary = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_lesson_revisions",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(null=True, blank=True)
    published_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="published_lesson_revisions",
    )

    class Meta:
        ordering = ("lesson", "-version")
        constraints = [
            models.UniqueConstraint(
                fields=("lesson", "version"), name="unique_lesson_revision_version"
            ),
            models.UniqueConstraint(
                fields=("lesson",),
                condition=Q(status="published"),
                name="one_published_revision_per_lesson",
            ),
            models.CheckConstraint(
                condition=(
                    Q(status="published", published_at__isnull=False, published_by__isnull=False)
                    | ~Q(status="published")
                ),
                name="published_revision_has_audit_fields",
            ),
        ]

    def clean(self):
        super().clean()
        if self.status == self.Status.PUBLISHED and (
            self.published_at is None or self.published_by_id is None
        ):
            raise ValidationError(
                "A published revision requires published_at and published_by."
            )

    def __str__(self):
        return f"{self.lesson.slug} v{self.version}"


class LessonTranslation(TimestampedModel):
    revision = models.ForeignKey(
        LessonRevision, on_delete=models.CASCADE, related_name="translations"
    )
    locale = models.CharField(max_length=10, validators=[validate_locale])
    status = models.CharField(
        max_length=12, choices=TranslationStatus, default=TranslationStatus.DRAFT
    )
    title = models.CharField(max_length=200)
    summary = models.TextField()
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)

    class Meta:
        ordering = ("revision", "locale")
        constraints = [
            models.UniqueConstraint(
                fields=("revision", "locale"), name="unique_lesson_revision_locale"
            )
        ]

    def __str__(self):
        return f"{self.revision} [{self.locale}]"


class LessonSection(models.Model):
    revision = models.ForeignKey(
        LessonRevision, on_delete=models.CASCADE, related_name="sections"
    )
    key = models.SlugField(max_length=80)
    sort_order = models.PositiveSmallIntegerField()

    class Meta:
        ordering = ("sort_order", "id")
        constraints = [
            models.UniqueConstraint(
                fields=("revision", "key"), name="unique_revision_section_key"
            ),
            models.UniqueConstraint(
                fields=("revision", "sort_order"), name="unique_revision_section_order"
            ),
        ]

    def __str__(self):
        return f"{self.revision}:{self.key}"


class LessonSectionTranslation(models.Model):
    section = models.ForeignKey(
        LessonSection, on_delete=models.CASCADE, related_name="translations"
    )
    locale = models.CharField(max_length=10, validators=[validate_locale])
    title = models.CharField(max_length=200)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("section", "locale"), name="unique_section_locale"
            )
        ]

    def __str__(self):
        return f"{self.section} [{self.locale}]"


class MediaAsset(TimestampedModel):
    key = models.SlugField(max_length=120, unique=True)
    url = models.URLField(max_length=500)
    mime_type = models.CharField(max_length=100)
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    byte_size = models.PositiveBigIntegerField(null=True, blank=True)
    checksum = models.CharField(max_length=128, blank=True)

    def __str__(self):
        return self.key


class LessonBlock(models.Model):
    class Type(models.TextChoices):
        NARRATIVE = "narrative", "Narrative"
        CALLOUT = "callout", "Callout"
        CODE = "code", "Code sample"
        TERMINAL = "terminal", "Terminal"
        IMAGE = "image", "Image"
        SIMULATION = "simulation", "Simulation"

    section = models.ForeignKey(
        LessonSection, on_delete=models.CASCADE, related_name="blocks"
    )
    key = models.SlugField(max_length=80)
    block_type = models.CharField(max_length=16, choices=Type)
    sort_order = models.PositiveSmallIntegerField()
    config = models.JSONField(default=dict, blank=True)
    media_asset = models.ForeignKey(
        MediaAsset,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="lesson_blocks",
    )

    class Meta:
        ordering = ("sort_order", "id")
        constraints = [
            models.UniqueConstraint(
                fields=("section", "key"), name="unique_section_block_key"
            ),
            models.UniqueConstraint(
                fields=("section", "sort_order"), name="unique_section_block_order"
            ),
        ]

    def clean(self):
        super().clean()
        validate_block_config(self.block_type, self.config)
        if self.block_type == self.Type.IMAGE and self.media_asset_id is None:
            raise ValidationError({"media_asset": "Image blocks require a media asset."})
        if self.block_type != self.Type.IMAGE and self.media_asset_id is not None:
            raise ValidationError(
                {"media_asset": "Only image blocks can reference a media asset."}
            )

    def __str__(self):
        return f"{self.section}:{self.key}"


class LessonBlockTranslation(models.Model):
    block = models.ForeignKey(
        LessonBlock, on_delete=models.CASCADE, related_name="translations"
    )
    locale = models.CharField(max_length=10, validators=[validate_locale])
    heading = models.CharField(max_length=200, blank=True)
    body = models.TextField(blank=True)
    content = models.JSONField(default=dict, blank=True)
    alt_text = models.CharField(max_length=300, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("block", "locale"), name="unique_block_locale"
            )
        ]

    def __str__(self):
        return f"{self.block} [{self.locale}]"


class Quiz(models.Model):
    revision = models.OneToOneField(
        LessonRevision, on_delete=models.CASCADE, related_name="quiz"
    )
    pass_percentage = models.PositiveSmallIntegerField(
        default=70, validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    shuffle_questions = models.BooleanField(default=False)
    shuffle_answers = models.BooleanField(default=False)

    def __str__(self):
        return f"Quiz for {self.revision}"


class QuizTranslation(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="translations")
    locale = models.CharField(max_length=10, validators=[validate_locale])
    title = models.CharField(max_length=200)
    instructions = models.TextField(blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("quiz", "locale"), name="unique_quiz_locale"
            )
        ]

    def __str__(self):
        return f"{self.quiz} [{self.locale}]"


class Question(models.Model):
    class Type(models.TextChoices):
        SINGLE = "single", "Single answer"
        MULTIPLE = "multiple", "Multiple answers"

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    key = models.SlugField(max_length=80)
    question_type = models.CharField(max_length=12, choices=Type, default=Type.SINGLE)
    sort_order = models.PositiveSmallIntegerField()
    points = models.PositiveSmallIntegerField(default=1, validators=[MinValueValidator(1)])

    class Meta:
        ordering = ("sort_order", "id")
        constraints = [
            models.UniqueConstraint(fields=("quiz", "key"), name="unique_quiz_question_key"),
            models.UniqueConstraint(
                fields=("quiz", "sort_order"), name="unique_quiz_question_order"
            ),
        ]

    def __str__(self):
        return f"{self.quiz}:{self.key}"


class QuestionTranslation(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="translations"
    )
    locale = models.CharField(max_length=10, validators=[validate_locale])
    prompt = models.TextField()
    explanation = models.TextField(blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("question", "locale"), name="unique_question_locale"
            )
        ]

    def __str__(self):
        return f"{self.question} [{self.locale}]"


class Answer(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers"
    )
    key = models.SlugField(max_length=80)
    sort_order = models.PositiveSmallIntegerField()
    is_correct = models.BooleanField(default=False)

    class Meta:
        ordering = ("sort_order", "id")
        constraints = [
            models.UniqueConstraint(
                fields=("question", "key"), name="unique_question_answer_key"
            ),
            models.UniqueConstraint(
                fields=("question", "sort_order"), name="unique_question_answer_order"
            ),
        ]

    def __str__(self):
        return f"{self.question}:{self.key}"


class AnswerTranslation(models.Model):
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name="translations")
    locale = models.CharField(max_length=10, validators=[validate_locale])
    text = models.TextField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("answer", "locale"), name="unique_answer_locale"
            )
        ]

    def __str__(self):
        return f"{self.answer} [{self.locale}]"
