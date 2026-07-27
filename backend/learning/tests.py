from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from learning.models import (
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
from lessons.models import Lesson, LessonRevision, Quiz


class LearningApiTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="learner",
            email="learner@example.com",
            password="test-password",
        )
        self.author = get_user_model().objects.create_user(username="author")
        self.lesson = Lesson.objects.create(
            slug="sql-injection",
            status=Lesson.Status.PUBLISHED,
            difficulty=Lesson.Difficulty.BEGINNER,
            sort_order=1,
            estimated_minutes=15,
            simulation_key="sql-injection",
        )
        self.revision = LessonRevision.objects.create(
            lesson=self.lesson,
            version=1,
            status=LessonRevision.Status.PUBLISHED,
            change_summary="Published test lesson.",
            created_by=self.author,
            published_at=timezone.now(),
            published_by=self.author,
        )
        Quiz.objects.create(
            revision=self.revision,
            pass_percentage=100,
            shuffle_questions=False,
            shuffle_answers=False,
        )
        self.xssi_lesson = Lesson.objects.create(
            slug="cross-site-script-inclusion",
            status=Lesson.Status.PUBLISHED,
            difficulty=Lesson.Difficulty.BEGINNER,
            sort_order=2,
            estimated_minutes=20,
            simulation_key="cross-site-script-inclusion",
        )
        self.xssi_revision = LessonRevision.objects.create(
            lesson=self.xssi_lesson,
            version=1,
            status=LessonRevision.Status.PUBLISHED,
            change_summary="Published XSSI test lesson.",
            created_by=self.author,
            published_at=timezone.now(),
            published_by=self.author,
        )
        self.path = LearningPath.objects.create(
            slug="web-security-basics",
            status=LearningPath.Status.PUBLISHED,
            sort_order=1,
            estimated_minutes=35,
        )
        LearningPathTranslation.objects.create(
            path=self.path,
            locale="en",
            title="Web Security Basics",
            summary="Learn the first web attacks.",
        )
        LearningPathLesson.objects.create(
            path=self.path,
            lesson=self.lesson,
            sort_order=1,
        )
        LearningPathLesson.objects.create(
            path=self.path,
            lesson=self.xssi_lesson,
            sort_order=2,
        )
        self.client = APIClient()

    def test_progress_requires_authentication(self):
        response = self.client.get(
            reverse("progress-detail", kwargs={"slug": self.lesson.slug})
        )

        self.assertEqual(response.status_code, 401)

    def test_bookmarks_require_authentication(self):
        response = self.client.get(reverse("bookmark-list"))

        self.assertEqual(response.status_code, 401)

    def test_user_can_save_list_and_remove_bookmark(self):
        self.client.force_authenticate(self.user)

        create_response = self.client.post(
            reverse("bookmark-detail", kwargs={"slug": self.lesson.slug})
        )
        duplicate_response = self.client.post(
            reverse("bookmark-detail", kwargs={"slug": self.lesson.slug})
        )
        list_response = self.client.get(reverse("bookmark-list"))

        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(duplicate_response.status_code, 200)
        self.assertEqual(LessonBookmark.objects.count(), 1)
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(list_response.data["results"][0]["lessonSlug"], "sql-injection")

        delete_response = self.client.delete(
            reverse("bookmark-detail", kwargs={"slug": self.lesson.slug})
        )

        self.assertEqual(delete_response.status_code, 204)
        self.assertEqual(LessonBookmark.objects.count(), 0)

    def test_user_can_create_and_update_lesson_feedback(self):
        self.client.force_authenticate(self.user)

        create_response = self.client.post(
            reverse("feedback-detail", kwargs={"slug": self.lesson.slug}),
            {
                "rating": 5,
                "difficulty": LessonFeedback.Difficulty.JUST_RIGHT,
                "comment": "Clear and useful.",
                "source": LessonFeedback.Source.QUIZ,
            },
            format="json",
        )

        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(create_response.data["lessonSlug"], "sql-injection")
        self.assertEqual(create_response.data["rating"], 5)
        self.assertEqual(create_response.data["locale"], "fa")
        self.assertEqual(LessonFeedback.objects.count(), 1)

        update_response = self.client.post(
            reverse("feedback-detail", kwargs={"slug": self.lesson.slug}),
            {"rating": 4, "difficulty": LessonFeedback.Difficulty.TOO_EASY},
            format="json",
        )

        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.data["rating"], 4)
        self.assertEqual(update_response.data["difficulty"], "too_easy")
        self.assertEqual(LessonFeedback.objects.count(), 1)

    def test_catalog_progress_returns_lesson_statuses(self):
        self.client.force_authenticate(self.user)
        LessonProgress.objects.create(
            user=self.user,
            lesson=self.lesson,
            revision=self.revision,
            total_steps=14,
            lesson_completed_at=timezone.now(),
            best_quiz_score=3,
            best_quiz_total=3,
        )

        response = self.client.get(reverse("catalog-progress"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["results"][0]["lessonSlug"], "sql-injection")
        self.assertEqual(response.data["results"][0]["status"], "completed")
        self.assertEqual(response.data["results"][0]["bestQuizScore"], 3)

    def test_xp_profile_starts_at_level_one(self):
        self.client.force_authenticate(self.user)

        response = self.client.get(reverse("xp-profile"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["totalXp"], 0)
        self.assertEqual(response.data["level"], 1)
        self.assertEqual(response.data["levelName"], "Beginner Analyst")

    def test_achievements_profile_returns_locked_catalog(self):
        self.client.force_authenticate(self.user)

        response = self.client.get(reverse("achievement-list"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["unlockedCount"], 0)
        self.assertGreaterEqual(response.data["totalCount"], 1)
        self.assertFalse(response.data["results"][0]["isUnlocked"])

    def test_learning_paths_return_progress_map(self):
        self.client.force_authenticate(self.user)

        response = self.client.get(reverse("path-list"), {"locale": "en"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["recommendedPathSlug"], "web-security-basics")
        path = response.data["results"][0]
        self.assertEqual(path["slug"], "web-security-basics")
        self.assertEqual(path["status"], "notStarted")
        self.assertTrue(path["isRecommended"])
        self.assertEqual(path["completedLessons"], 0)
        self.assertEqual(path["remainingLessons"], 2)
        self.assertEqual(path["nextLessonSlug"], "sql-injection")
        self.assertEqual(path["nextLesson"]["slug"], "sql-injection")
        self.assertEqual(path["lessons"][0]["status"], "current")
        self.assertEqual(path["lessons"][1]["status"], "locked")

    def test_learning_paths_mark_next_lesson_after_completion(self):
        self.client.force_authenticate(self.user)
        LessonProgress.objects.create(
            user=self.user,
            lesson=self.lesson,
            revision=self.revision,
            total_steps=14,
            lesson_completed_at=timezone.now(),
        )

        response = self.client.get(reverse("path-list"), {"locale": "en"})

        self.assertEqual(response.status_code, 200)
        path = response.data["results"][0]
        self.assertEqual(path["status"], "inProgress")
        self.assertEqual(path["completedLessons"], 1)
        self.assertEqual(path["remainingLessons"], 1)
        self.assertEqual(path["progressPercent"], 50)
        self.assertEqual(path["nextLessonSlug"], "cross-site-script-inclusion")
        self.assertEqual(path["nextLesson"]["slug"], "cross-site-script-inclusion")
        self.assertEqual(path["lessons"][0]["status"], "completed")
        self.assertEqual(path["lessons"][1]["status"], "current")

    def test_recommendation_uses_first_incomplete_path_lesson(self):
        self.client.force_authenticate(self.user)

        initial_response = self.client.get(reverse("recommendation"), {"locale": "en"})

        self.assertEqual(initial_response.status_code, 200)
        self.assertEqual(
            initial_response.data["recommendation"]["lesson"]["slug"],
            "sql-injection",
        )

        LessonProgress.objects.create(
            user=self.user,
            lesson=self.lesson,
            revision=self.revision,
            total_steps=14,
            lesson_completed_at=timezone.now(),
        )

        next_response = self.client.get(reverse("recommendation"), {"locale": "en"})

        self.assertEqual(next_response.status_code, 200)
        self.assertEqual(
            next_response.data["recommendation"]["lesson"]["slug"],
            "cross-site-script-inclusion",
        )

    def test_patch_progress_creates_and_updates_lesson_progress(self):
        self.client.force_authenticate(self.user)

        response = self.client.patch(
            reverse("progress-detail", kwargs={"slug": self.lesson.slug}),
            {
                "currentStep": 11,
                "totalSteps": 14,
                "interactiveCompleted": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["lessonSlug"], "sql-injection")
        self.assertEqual(response.data["currentStep"], 11)
        self.assertEqual(response.data["totalSteps"], 14)
        self.assertIsNotNone(response.data["interactiveCompletedAt"])

        progress = LessonProgress.objects.get(user=self.user, lesson=self.lesson)
        self.assertEqual(progress.revision, self.revision)
        self.assertEqual(progress.current_step, 11)

        self.assertEqual(
            LearningXpEvent.objects.filter(user=self.user).count(),
            2,
        )
        self.assertEqual(
            sum(event.xp_amount for event in LearningXpEvent.objects.filter(user=self.user)),
            12,
        )
        self.assertEqual(
            set(LearningAchievement.objects.values_list("code", flat=True)),
            {"firstExploit"},
        )

        duplicate_response = self.client.patch(
            reverse("progress-detail", kwargs={"slug": self.lesson.slug}),
            {
                "currentStep": 12,
                "totalSteps": 14,
                "interactiveCompleted": True,
            },
            format="json",
        )

        self.assertEqual(duplicate_response.status_code, 200)
        self.assertEqual(
            sum(event.xp_amount for event in LearningXpEvent.objects.filter(user=self.user)),
            12,
        )
        self.assertEqual(LearningAchievement.objects.count(), 1)

    def test_quiz_attempt_updates_progress_and_marks_passed_completion(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("quiz-attempt-create", kwargs={"slug": self.lesson.slug}),
            {
                "score": 3,
                "totalQuestions": 3,
                "answers": {"orm-immunity": "false"},
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["attempt"]["passed"])
        self.assertEqual(response.data["progress"]["bestQuizScore"], 3)
        self.assertEqual(response.data["progress"]["bestQuizTotal"], 3)
        self.assertIsNotNone(response.data["progress"]["quizCompletedAt"])
        self.assertIsNotNone(response.data["progress"]["lessonCompletedAt"])
        self.assertEqual(
            response.data["recommendation"]["lesson"]["slug"],
            "cross-site-script-inclusion",
        )

        self.assertEqual(QuizAttempt.objects.count(), 1)
        progress = LessonProgress.objects.get(user=self.user, lesson=self.lesson)
        self.assertEqual(progress.best_quiz_score, 3)
        self.assertEqual(progress.best_quiz_total, 3)

        xp_events = LearningXpEvent.objects.filter(user=self.user)
        self.assertEqual(sum(event.xp_amount for event in xp_events), 37)
        self.assertEqual(
            set(xp_events.values_list("event_type", flat=True)),
            {
                LearningXpEvent.Type.LESSON_STARTED,
                LearningXpEvent.Type.QUIZ_PASSED,
                LearningXpEvent.Type.QUIZ_FIRST_TRY,
                LearningXpEvent.Type.LESSON_COMPLETED,
            },
        )
        self.assertEqual(
            set(LearningAchievement.objects.values_list("code", flat=True)),
            {
                "firstQuizPassed",
                "firstPerfectQuiz",
                "firstLessonCompleted",
                "sqlInjectionCompleted",
            },
        )
