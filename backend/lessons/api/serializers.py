from rest_framework import serializers

from lessons.models import LessonBlock, LessonRevision
from lessons.services import get_required_lesson_locales
from lessons.validators import validate_locale as validate_locale_shape


class LocaleQuerySerializer(serializers.Serializer):
    locale = serializers.CharField(required=False, allow_blank=True, max_length=10)

    def validate_locale(self, value):
        if not value:
            return default_locale()
        validate_locale_shape(value)
        return value


def serialize_catalog_lesson(lesson, locale):
    revision = published_revision(lesson)
    translation = select_translation(revision.translations.all(), locale)

    return {
        "slug": lesson.slug,
        "difficulty": lesson.difficulty,
        "sortOrder": lesson.sort_order,
        "estimatedMinutes": lesson.estimated_minutes,
        "simulationKey": lesson.simulation_key,
        "revision": serialize_revision_summary(revision),
        "locale": translation.locale,
        "title": translation.title,
        "summary": translation.summary,
    }


def serialize_lesson_detail(lesson, locale):
    revision = published_revision(lesson)
    return serialize_lesson_revision_detail(revision, locale)


def serialize_lesson_revision_detail(revision, locale):
    lesson = revision.lesson
    translation = select_translation(revision.translations.all(), locale)

    return {
        "slug": lesson.slug,
        "status": lesson.status,
        "difficulty": lesson.difficulty,
        "sortOrder": lesson.sort_order,
        "estimatedMinutes": lesson.estimated_minutes,
        "simulationKey": lesson.simulation_key,
        "revision": serialize_revision_summary(revision),
        "requestedLocale": locale,
        "locale": translation.locale,
        "title": translation.title,
        "summary": translation.summary,
        "seo": {
            "title": translation.seo_title,
            "description": translation.seo_description,
        },
        "prerequisites": [
            link.prerequisite.slug for link in lesson.prerequisite_links.all()
        ],
        "sections": [serialize_section(section, locale) for section in revision.sections.all()],
        "quiz": serialize_quiz(optional_related(revision, "quiz"), locale),
    }


def serialize_revision_summary(revision):
    return {
        "id": revision.pk,
        "version": revision.version,
        "status": revision.status,
        "publishedAt": revision.published_at,
    }


def serialize_section(section, locale):
    translation = select_translation(section.translations.all(), locale)

    return {
        "key": section.key,
        "sortOrder": section.sort_order,
        "locale": translation.locale,
        "title": translation.title,
        "blocks": [serialize_block(block, locale) for block in section.blocks.all()],
    }


def serialize_block(block, locale):
    translation = select_translation(block.translations.all(), locale)

    payload = {
        "key": block.key,
        "type": block.block_type,
        "sortOrder": block.sort_order,
        "config": block.config,
        "locale": translation.locale,
        "heading": translation.heading,
        "body": translation.body,
        "content": translation.content,
        "altText": translation.alt_text,
    }
    if block.block_type == LessonBlock.Type.IMAGE:
        payload["media"] = serialize_media_asset(block.media_asset)
    return payload


def serialize_media_asset(media_asset):
    if media_asset is None:
        return None
    return {
        "key": media_asset.key,
        "url": media_asset.url,
        "mimeType": media_asset.mime_type,
        "width": media_asset.width,
        "height": media_asset.height,
        "byteSize": media_asset.byte_size,
        "checksum": media_asset.checksum,
    }


def serialize_quiz(quiz, locale):
    if quiz is None:
        return None

    translation = select_translation(quiz.translations.all(), locale)

    return {
        "passPercentage": quiz.pass_percentage,
        "shuffleQuestions": quiz.shuffle_questions,
        "shuffleAnswers": quiz.shuffle_answers,
        "locale": translation.locale,
        "title": translation.title,
        "instructions": translation.instructions,
        "questions": [
            serialize_question(question, locale) for question in quiz.questions.all()
        ],
    }


def serialize_question(question, locale):
    translation = select_translation(question.translations.all(), locale)

    return {
        "key": question.key,
        "type": question.question_type,
        "sortOrder": question.sort_order,
        "points": question.points,
        "locale": translation.locale,
        "prompt": translation.prompt,
        "explanation": translation.explanation,
        "answers": [serialize_answer(answer, locale) for answer in question.answers.all()],
    }


def serialize_answer(answer, locale):
    translation = select_translation(answer.translations.all(), locale)

    return {
        "key": answer.key,
        "sortOrder": answer.sort_order,
        "text": translation.text,
        "isCorrect": answer.is_correct,
    }


def published_revision(lesson):
    return next(
        revision
        for revision in lesson.revisions.all()
        if revision.status == LessonRevision.Status.PUBLISHED
    )


def select_translation(translations, requested_locale):
    translations_by_locale = {translation.locale: translation for translation in translations}
    if requested_locale in translations_by_locale:
        return translations_by_locale[requested_locale]

    for locale in get_required_lesson_locales():
        if locale in translations_by_locale:
            return translations_by_locale[locale]

    if translations_by_locale:
        return next(iter(translations_by_locale.values()))

    return MissingTranslation(requested_locale)


def default_locale():
    locales = get_required_lesson_locales()
    return locales[0]


def optional_related(obj, name):
    try:
        return getattr(obj, name)
    except AttributeError:
        return None
    except Exception as exc:
        if exc.__class__.__name__ == "RelatedObjectDoesNotExist":
            return None
        raise


class MissingTranslation:
    title = ""
    summary = ""
    seo_title = ""
    seo_description = ""
    heading = ""
    body = ""
    content = {}
    alt_text = ""
    instructions = ""
    prompt = ""
    explanation = ""
    text = ""

    def __init__(self, locale):
        self.locale = locale
