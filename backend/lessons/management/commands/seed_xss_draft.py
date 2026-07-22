from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import IntegrityError, transaction
from django.db.models import Max

from lessons.models import (
    Lesson,
    LessonBlock,
    LessonBlockTranslation,
    LessonRevision,
    LessonSection,
    LessonSectionTranslation,
    LessonTranslation,
    TranslationStatus,
)
from lessons.seed_content.cross_site_scripting import LESSON, inline_plain_text


class Command(BaseCommand):
    help = "Seed the incomplete Cross-Site Scripting lesson as a draft."

    def add_arguments(self, parser):
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
                "Could not seed XSS draft. Check sort_order uniqueness or existing lesson data."
            ) from exc

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {LESSON['slug']} revision v{revision.version} as draft."
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
            "status": Lesson.Status.DRAFT,
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
        change_summary="Draft seed from the current incomplete frontend XSS lesson.",
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
        key="guide-draft",
        sort_order=2,
    )
    create_section_translations(guide_section, "Guide draft")
    create_guide_draft_block(guide_section)


def create_revision_translations(revision):
    for locale in LESSON["required_locales"]:
        LessonTranslation.objects.create(
            revision=revision,
            locale=locale,
            status=TranslationStatus.DRAFT,
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
        key="breddit-demo",
        block_type=LessonBlock.Type.SIMULATION,
        sort_order=len(LESSON["steps"]) + 1,
        config={
            "registry_key": LESSON["simulation_key"],
            "initial_state": {
                "guide_path": LESSON["guide_path"],
                "lessons_path": LESSON["lessons_path"],
                "total_steps": LESSON["total_steps"],
                "final_step": LESSON["final_step"],
                "simulation": LESSON["simulation"],
            },
        },
    )
    create_block_translations(simulation)


def create_guide_draft_block(section):
    block = create_block(
        section,
        key="xss-guide-draft",
        block_type=LessonBlock.Type.SIMULATION,
        sort_order=1,
        config={"registry_key": "cross-site-scripting-guide-draft"},
    )
    create_block_translations(
        block,
        heading=LESSON["guide"]["overview"]["title"],
        body="Cross-Site Scripting guide draft",
        content={"guide": LESSON["guide"]},
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
