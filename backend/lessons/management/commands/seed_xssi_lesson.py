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
from lessons.seed_content.cross_site_script_inclusion import LESSON, inline_plain_text
from lessons.seed_content.cross_site_script_inclusion_guide import GUIDE
from lessons.services import publish_revision


class Command(BaseCommand):
    help = "Seed the Cross-Site Script Inclusion lesson into the relational lesson models."

    def add_arguments(self, parser):
        parser.add_argument("--publish", action="store_true")
        parser.add_argument("--reset", action="store_true")
        parser.add_argument("--username", default="lesson-seeder")

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
                "Could not seed XSSI. Check sort_order uniqueness or existing lesson data."
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
        change_summary="Faithful seed from the existing frontend XSSI lesson.",
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
        LessonTranslation.objects.create(
            revision=revision,
            locale=locale,
            status=TranslationStatus.READY,
            title=LESSON["title"],
            summary=LESSON["summary"],
            seo_title=LESSON["title"],
            seo_description=LESSON["summary"],
        )


def create_section_translations(section, title):
    for locale in LESSON["required_locales"]:
        LessonSectionTranslation.objects.create(section=section, locale=locale, title=title)


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
        create_block_translations(
            block,
            body=inline_plain_text(parts),
            content={"parts": parts},
        )

    simulation = create_block(
        section,
        key="xssi-demo",
        block_type=LessonBlock.Type.SIMULATION,
        sort_order=len(LESSON["steps"]) + 1,
        config={
            "registry_key": LESSON["simulation_key"],
            "initial_state": {
                "origin_table": LESSON["origin_table"],
                "code_examples": LESSON["code_examples"],
                "guide_path": LESSON["guide_path"],
                "quiz_path": LESSON["quiz_path"],
                "quiz_start_path": LESSON["quiz_start_path"],
                "lessons_path": LESSON["lessons_path"],
                "quiz_intro": LESSON["quiz_intro"],
                "total_steps": LESSON["total_steps"],
                "final_step": LESSON["final_step"],
            },
        },
    )
    create_block_translations(simulation)

    completion = create_block(
        section,
        key="completion",
        block_type=LessonBlock.Type.CALLOUT,
        sort_order=len(LESSON["steps"]) + 2,
        config={"tone": "next-step", "action_path": LESSON["guide_path"]},
    )
    create_block_translations(
        completion,
        body=inline_plain_text(LESSON["completion"]),
        content={"parts": LESSON["completion"]},
    )


def create_guide_block(section):
    block = create_block(
        section,
        key="xssi-guide",
        block_type=LessonBlock.Type.SIMULATION,
        sort_order=1,
        config={"registry_key": "cross-site-script-inclusion-guide"},
    )
    create_block_translations(
        block,
        heading=GUIDE["overview"]["title"],
        body="Cross-Site Script Inclusion guide",
        content={"guide": GUIDE},
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
        QuizTranslation.objects.create(
            quiz=quiz,
            locale=locale,
            title=quiz_data["title"],
            instructions=quiz_data["instructions"],
        )

    for question_index, question_data in enumerate(quiz_data["questions"], start=1):
        question = Question.objects.create(
            quiz=quiz,
            key=question_data["key"],
            question_type=question_data["type"],
            sort_order=question_index,
        )
        for locale in LESSON["required_locales"]:
            QuestionTranslation.objects.create(
                question=question,
                locale=locale,
                prompt=question_data["prompt"],
            )

        for answer_index, answer_data in enumerate(question_data["answers"], start=1):
            answer = Answer.objects.create(
                question=question,
                key=answer_data["key"],
                sort_order=answer_index,
                is_correct=answer_data["is_correct"],
            )
            for locale in LESSON["required_locales"]:
                AnswerTranslation.objects.create(
                    answer=answer,
                    locale=locale,
                    text=answer_data["text"],
                )
