from collections import defaultdict

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from .cache import invalidate_published_lesson_cache
from .models import Lesson, LessonBlock, LessonRevision, Question, TranslationStatus


DEFAULT_REQUIRED_LOCALES = ("fa", "en")


def get_required_lesson_locales(required_locales=None):
    locales = required_locales or getattr(
        settings, "LESSON_REQUIRED_LOCALES", DEFAULT_REQUIRED_LOCALES
    )
    return tuple(dict.fromkeys(locale.strip() for locale in locales if locale.strip()))


def validate_revision_ready_for_publish(revision, required_locales=None):
    errors = build_publish_readiness_errors(revision, required_locales)
    if errors:
        raise ValidationError(errors)


def build_publish_readiness_errors(revision, required_locales=None):
    required_locales = get_required_lesson_locales(required_locales)
    errors = defaultdict(list)

    if not required_locales:
        add_error(errors, "locales", "At least one required locale must be configured.")

    if revision.status != LessonRevision.Status.DRAFT:
        add_error(errors, "status", "Only draft revisions can be published.")

    lesson = getattr(revision, "lesson", None)
    if lesson is not None and lesson.status == Lesson.Status.ARCHIVED:
        add_error(errors, "lesson", "Archived lessons cannot publish new revisions.")

    require_translation_rows(
        errors,
        "translations",
        related_list(revision.translations),
        required_locales,
        required_fields=("title", "summary"),
        require_ready_status=True,
    )

    sections = related_list(revision.sections)
    if not sections:
        add_error(errors, "sections", "A publishable revision needs at least one section.")

    for section in sections:
        section_path = f"sections.{object_key(section)}"
        require_translation_rows(
            errors,
            f"{section_path}.translations",
            related_list(section.translations),
            required_locales,
            required_fields=("title",),
        )

        blocks = related_list(section.blocks)
        if not blocks:
            add_error(errors, section_path, "Each section needs at least one block.")
        for block in blocks:
            validate_block(errors, section_path, block, required_locales)

    quiz = getattr(revision, "quiz", None)
    if quiz is None:
        add_error(errors, "quiz", "A publishable revision needs a quiz.")
    else:
        validate_quiz(errors, quiz, required_locales)

    return dict(errors)


def publish_revision(revision_id, *, published_by, required_locales=None):
    with transaction.atomic():
        revision = (
            LessonRevision.objects.select_for_update()
            .select_related("lesson")
            .get(pk=revision_id)
        )
        Lesson.objects.select_for_update().get(pk=revision.lesson_id)

        validate_revision_ready_for_publish(revision, required_locales)

        now = timezone.now()
        LessonRevision.objects.select_for_update().filter(
            lesson_id=revision.lesson_id,
            status=LessonRevision.Status.PUBLISHED,
        ).exclude(pk=revision.pk).update(status=LessonRevision.Status.RETIRED)

        revision.status = LessonRevision.Status.PUBLISHED
        revision.published_at = now
        revision.published_by = published_by
        revision.full_clean()
        revision.save(update_fields=("status", "published_at", "published_by"))

        revision.lesson.status = Lesson.Status.PUBLISHED
        revision.lesson.save(update_fields=("status", "updated_at"))

        transaction.on_commit(
            lambda: invalidate_published_lesson_cache(
                revision.lesson.slug,
                revision.pk,
                get_required_lesson_locales(required_locales),
            )
        )

    return revision


def validate_block(errors, section_path, block, required_locales):
    block_path = f"{section_path}.blocks.{object_key(block)}"
    try:
        block.clean()
    except ValidationError as exc:
        for message in exc.messages:
            add_error(errors, block_path, message)

    require_translation_rows(
        errors,
        f"{block_path}.translations",
        related_list(block.translations),
        required_locales,
        required_fields=block_translation_fields(block),
    )


def validate_quiz(errors, quiz, required_locales):
    require_translation_rows(
        errors,
        "quiz.translations",
        related_list(quiz.translations),
        required_locales,
        required_fields=("title",),
    )

    questions = related_list(quiz.questions)
    if not questions:
        add_error(errors, "quiz.questions", "A quiz needs at least one question.")

    for question in questions:
        question_path = f"quiz.questions.{object_key(question)}"
        require_translation_rows(
            errors,
            f"{question_path}.translations",
            related_list(question.translations),
            required_locales,
            required_fields=("prompt",),
        )
        validate_answers(errors, question_path, question, required_locales)


def validate_answers(errors, question_path, question, required_locales):
    answers = related_list(question.answers)
    if len(answers) < 2:
        add_error(errors, f"{question_path}.answers", "Each question needs at least two answers.")

    correct_count = sum(1 for answer in answers if answer.is_correct)
    if correct_count == 0:
        add_error(errors, question_path, "Each question needs at least one correct answer.")
    if question.question_type == Question.Type.SINGLE and correct_count != 1:
        add_error(errors, question_path, "Single-answer questions need exactly one correct answer.")
    if question.question_type == Question.Type.MULTIPLE and correct_count < 2:
        add_error(errors, question_path, "Multiple-answer questions need at least two correct answers.")

    for answer in answers:
        require_translation_rows(
            errors,
            f"{question_path}.answers.{object_key(answer)}.translations",
            related_list(answer.translations),
            required_locales,
            required_fields=("text",),
        )


def require_translation_rows(
    errors,
    path,
    translations,
    required_locales,
    *,
    required_fields,
    require_ready_status=False,
):
    translations_by_locale = {translation.locale: translation for translation in translations}

    for locale in required_locales:
        translation = translations_by_locale.get(locale)
        if translation is None:
            add_error(errors, path, f"Missing {locale} translation.")
            continue

        for field in required_fields:
            if not text_present(getattr(translation, field, "")):
                add_error(errors, f"{path}.{locale}", f"Missing {field}.")

        if require_ready_status and translation.status != TranslationStatus.READY:
            add_error(errors, f"{path}.{locale}", "Translation must be marked ready.")


def block_translation_fields(block):
    if block.block_type == LessonBlock.Type.IMAGE:
        return ("alt_text",)
    if block.block_type == LessonBlock.Type.SIMULATION:
        return ()
    return ("body",)


def related_list(manager_or_iterable):
    if hasattr(manager_or_iterable, "all"):
        return list(manager_or_iterable.all())
    return list(manager_or_iterable)


def object_key(obj):
    return getattr(obj, "key", None) or getattr(obj, "slug", None) or str(getattr(obj, "pk", "new"))


def text_present(value):
    return isinstance(value, str) and bool(value.strip())


def add_error(errors, path, message):
    errors[path].append(message)
