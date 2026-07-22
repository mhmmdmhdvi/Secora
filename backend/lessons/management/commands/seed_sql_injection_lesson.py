from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import IntegrityError, transaction
from django.db.models import Max

from lessons.models import (
    Answer,
    AnswerTranslation,
    Lesson,
    LessonBlock,
    LessonBlockTranslation,
    LessonRevision,
    LessonSection,
    LessonSectionTranslation,
    LessonTranslation,
    Question,
    QuestionTranslation,
    Quiz,
    QuizTranslation,
    TranslationStatus,
)
from lessons.seed_content.sql_injection_guide import GUIDE, GUIDE_TRANSLATIONS
from lessons.seed_content.sql_injection import LESSON, LESSON_TRANSLATIONS, inline_plain_text
from lessons.services import publish_revision


class Command(BaseCommand):
    help = "Seed the SQL Injection lesson into the relational lesson models."

    def add_arguments(self, parser):
        parser.add_argument(
            "--publish",
            action="store_true",
            help="Publish the seeded revision after it passes readiness validation.",
        )
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete and recreate only the sql-injection lesson before seeding.",
        )
        parser.add_argument(
            "--username",
            default="lesson-seeder",
            help="Username used for revision audit fields.",
        )

    def handle(self, *args, **options):
        user = seed_user(options["username"])

        try:
            with transaction.atomic():
                if options["reset"]:
                    Lesson.objects.filter(slug=LESSON["slug"]).delete()

                lesson = upsert_lesson()
                revision = create_or_replace_draft_revision(lesson, user)
                seed_revision(revision)
        except IntegrityError as exc:
            raise CommandError(
                "Could not seed SQL Injection. Check sort_order uniqueness or existing lesson data."
            ) from exc

        if options["publish"]:
            revision = publish_revision(
                revision.pk,
                published_by=user,
                required_locales=LESSON["required_locales"],
            )

        state = "published" if options["publish"] else "draft"
        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {LESSON['slug']} revision v{revision.version} as {state}."
            )
        )


def seed_user(username):
    User = get_user_model()
    user, created = User.objects.get_or_create(
        username=username,
        defaults={"email": f"{username}@securelearn.local"},
    )
    if created:
        user.set_unusable_password()
        user.save(update_fields=("password",))
    return user


def upsert_lesson():
    lesson, _ = Lesson.objects.update_or_create(
        slug=LESSON["slug"],
        defaults={
            "difficulty": LESSON["difficulty"],
            "sort_order": LESSON["sort_order"],
            "estimated_minutes": LESSON["estimated_minutes"],
            "simulation_key": LESSON["simulation_key"],
        },
    )
    return lesson


def create_or_replace_draft_revision(lesson, user):
    draft = (
        lesson.revisions.filter(status=LessonRevision.Status.DRAFT)
        .order_by("-version")
        .first()
    )

    if draft is not None:
        version = draft.version
        draft.delete()
    else:
        version = (lesson.revisions.aggregate(Max("version"))["version__max"] or 0) + 1

    return LessonRevision.objects.create(
        lesson=lesson,
        version=version,
        status=LessonRevision.Status.DRAFT,
        change_summary="Faithful seed from the existing frontend SQL Injection lesson.",
        created_by=user,
    )


def seed_revision(revision):
    create_revision_translations(revision)
    interactive_section = LessonSection.objects.create(
        revision=revision,
        key="interactive-demo",
        sort_order=1,
    )
    create_section_translations(interactive_section, "Interactive demo")
    create_interactive_blocks(interactive_section)
    guide_section = LessonSection.objects.create(
        revision=revision,
        key="guide",
        sort_order=2,
    )
    create_section_translations(guide_section, "Guide")
    create_guide_block(guide_section)
    create_quiz(revision)


def create_revision_translations(revision):
    for locale in LESSON["required_locales"]:
        lesson_data = localized_lesson(locale)
        LessonTranslation.objects.create(
            revision=revision,
            locale=locale,
            status=TranslationStatus.READY,
            title=lesson_data["title"],
            summary=lesson_data["summary"],
            seo_title=lesson_data["title"],
            seo_description=lesson_data["summary"],
        )


def create_section_translations(section, title):
    for locale in LESSON["required_locales"]:
        LessonSectionTranslation.objects.create(
            section=section,
            locale=locale,
            title=localized_section_title(title, locale),
        )


def create_block_translations(block, *, body="", heading="", content=None):
    for locale in LESSON["required_locales"]:
        LessonBlockTranslation.objects.create(
            block=block,
            locale=locale,
            heading=heading,
            body=body,
            content=content or {},
        )


def create_interactive_blocks(section):
    for index, parts in enumerate(LESSON["steps"], start=1):
        block = create_block(
            section,
            key=f"step-{index:02d}",
            block_type=LessonBlock.Type.NARRATIVE,
            sort_order=index,
            config={"tone": "instruction"},
        )
        for locale in LESSON["required_locales"]:
            localized_parts = localized_lesson(locale)["steps"][index - 1]
            LessonBlockTranslation.objects.create(
                block=block,
                locale=locale,
                body=inline_plain_text(localized_parts),
                content={"parts": localized_parts},
            )

    simulation = create_block(
        section,
        key="secure-bank-demo",
        block_type=LessonBlock.Type.SIMULATION,
        sort_order=len(LESSON["steps"]) + 1,
        config={
            "registry_key": LESSON["simulation_key"],
            "initial_state": {
                "bank": LESSON["bank"],
                "credentials": LESSON["credentials"],
                "logs": LESSON["logs"],
                "query": LESSON["query"],
                "guide_path": LESSON["guide_path"],
                "quiz_path": LESSON["quiz_path"],
                "quiz_start_path": LESSON["quiz_start_path"],
                "lessons_path": LESSON["lessons_path"],
                "quiz_intro": LESSON["quiz_intro"],
                "successful_login_step": 10,
            },
        },
    )
    for locale in LESSON["required_locales"]:
        LessonBlockTranslation.objects.create(
            block=simulation,
            locale=locale,
            content={"initial_state": simulation_initial_state(localized_lesson(locale))},
        )

    completion = create_block(
        section,
        key="completion",
        block_type=LessonBlock.Type.CALLOUT,
        sort_order=len(LESSON["steps"]) + 2,
        config={"tone": "next-step", "action_path": LESSON["guide_path"]},
    )
    for locale in LESSON["required_locales"]:
        completion_parts = localized_lesson(locale)["completion"]
        LessonBlockTranslation.objects.create(
            block=completion,
            locale=locale,
            body=inline_plain_text(completion_parts),
            heading=localized_completion_heading(locale),
            content={"parts": completion_parts},
        )


def create_guide_block(section):
    block = create_block(
        section,
        key="sql-injection-guide",
        block_type=LessonBlock.Type.SIMULATION,
        sort_order=1,
        config={"registry_key": "sql-injection-guide"},
    )
    for locale in LESSON["required_locales"]:
        guide = localized_guide(locale)
        LessonBlockTranslation.objects.create(
            block=block,
            locale=locale,
            heading=guide["overview"]["title"],
            body=localized_guide_body(locale),
            content={"guide": guide},
        )


def create_block(section, *, key, block_type, sort_order, config):
    block = LessonBlock(
        section=section,
        key=key,
        block_type=block_type,
        sort_order=sort_order,
        config=config,
    )
    block.full_clean()
    block.save()
    return block


def create_quiz(revision):
    quiz_data = LESSON["quiz"]
    quiz = Quiz.objects.create(
        revision=revision,
        pass_percentage=quiz_data["pass_percentage"],
        shuffle_questions=quiz_data["shuffle_questions"],
        shuffle_answers=quiz_data["shuffle_answers"],
    )

    for locale in LESSON["required_locales"]:
        localized_quiz = localized_lesson(locale)["quiz"]
        QuizTranslation.objects.create(
            quiz=quiz,
            locale=locale,
            title=localized_quiz["title"],
            instructions=localized_quiz["instructions"],
        )

    for question_index, question_data in enumerate(quiz_data["questions"], start=1):
        question = Question.objects.create(
            quiz=quiz,
            key=question_data["key"],
            question_type=question_data["type"],
            sort_order=question_index,
        )
        for locale in LESSON["required_locales"]:
            localized_question = localized_lesson(locale)["quiz"]["questions"][
                question_index - 1
            ]
            QuestionTranslation.objects.create(
                question=question,
                locale=locale,
                prompt=localized_question["prompt"],
            )

        for answer_index, answer_data in enumerate(question_data["answers"], start=1):
            answer = Answer.objects.create(
                question=question,
                key=answer_data["key"],
                sort_order=answer_index,
                is_correct=answer_data["is_correct"],
            )
            for locale in LESSON["required_locales"]:
                localized_answer = localized_lesson(locale)["quiz"]["questions"][
                    question_index - 1
                ]["answers"][answer_index - 1]
                AnswerTranslation.objects.create(
                    answer=answer,
                    locale=locale,
                    text=localized_answer["text"],
                )


def simulation_initial_state(lesson_data):
    return {
        "bank": lesson_data["bank"],
        "credentials": lesson_data["credentials"],
        "logs": lesson_data["logs"],
        "query": lesson_data["query"],
        "guide_path": lesson_data["guide_path"],
        "quiz_path": lesson_data["quiz_path"],
        "quiz_start_path": lesson_data["quiz_start_path"],
        "lessons_path": lesson_data["lessons_path"],
        "quiz_intro": lesson_data["quiz_intro"],
        "successful_login_step": 10,
    }


def localized_lesson(locale):
    return LESSON_TRANSLATIONS.get(locale, LESSON)


def localized_guide(locale):
    return GUIDE_TRANSLATIONS.get(locale, GUIDE)


def localized_section_title(title, locale):
    if locale != "fa":
        return title
    return {
        "Interactive demo": "دموی تعاملی",
        "Guide": "راهنما",
    }.get(title, title)


def localized_completion_heading(locale):
    if locale == "fa":
        return "بعدی: محافظت در برابر SQL Injection"
    return "Next: protect against SQL injection"


def localized_guide_body(locale):
    if locale == "fa":
        return "راهنمای SQL Injection"
    return "SQL Injection guide"
