from django.core.management.base import BaseCommand
from django.db import transaction

from learning.models import (
    LearningPath,
    LearningPathLesson,
    LearningPathTranslation,
)
from lessons.models import Lesson


PATHS = [
    {
        "slug": "web-security-basics",
        "sort_order": 1,
        "estimated_minutes": 75,
        "lesson_slugs": [
            "sql-injection",
            "cross-site-script-inclusion",
            "cross-site-scripting",
        ],
        "translations": {
            "en": {
                "title": "Web Security Basics",
                "summary": "Start with the core web attacks every secure developer should recognize.",
            },
            "fa": {
                "title": "مبانی امنیت وب",
                "summary": "از حمله‌های اصلی وب شروع کن؛ همان چیزهایی که هر توسعه‌دهنده امن باید بشناسد.",
            },
        },
    },
    {
        "slug": "client-side-attacks",
        "sort_order": 2,
        "estimated_minutes": 60,
        "lesson_slugs": [
            "cross-site-script-inclusion",
            "cross-site-scripting",
        ],
        "translations": {
            "en": {
                "title": "Client-Side Attacks",
                "summary": "Learn how browser-side trust can leak data or execute attacker-controlled code.",
            },
            "fa": {
                "title": "حمله‌های سمت کاربر",
                "summary": "یاد بگیر اعتماد اشتباه در مرورگر چطور می‌تواند داده را نشت دهد یا کد مهاجم را اجرا کند.",
            },
        },
    },
]


class Command(BaseCommand):
    help = "Seed the first learning paths from lessons that already exist."

    @transaction.atomic
    def handle(self, *args, **options):
        created_count = 0

        for path_data in PATHS:
            lessons = list(
                Lesson.objects.filter(
                    slug__in=path_data["lesson_slugs"],
                    status=Lesson.Status.PUBLISHED,
                )
            )
            lessons_by_slug = {lesson.slug: lesson for lesson in lessons}
            ordered_lessons = [
                lessons_by_slug[slug]
                for slug in path_data["lesson_slugs"]
                if slug in lessons_by_slug
            ]

            if not ordered_lessons:
                self.stdout.write(
                    self.style.WARNING(
                        f"Skipped {path_data['slug']}: no published lessons found."
                    )
                )
                continue

            path, created = LearningPath.objects.update_or_create(
                slug=path_data["slug"],
                defaults={
                    "status": LearningPath.Status.PUBLISHED,
                    "sort_order": path_data["sort_order"],
                    "estimated_minutes": path_data["estimated_minutes"],
                },
            )
            created_count += int(created)

            for locale, translation in path_data["translations"].items():
                LearningPathTranslation.objects.update_or_create(
                    path=path,
                    locale=locale,
                    defaults=translation,
                )

            LearningPathLesson.objects.filter(path=path).exclude(
                lesson__in=ordered_lessons
            ).delete()
            for index, lesson in enumerate(ordered_lessons, start=1):
                LearningPathLesson.objects.update_or_create(
                    path=path,
                    lesson=lesson,
                    defaults={"sort_order": index},
                )

        self.stdout.write(
            self.style.SUCCESS(f"Seeded learning paths. Created {created_count} new path(s).")
        )
