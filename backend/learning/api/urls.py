from django.urls import path

from .views import (
    LearningAchievementListView,
    LearningPathListView,
    LearningXpProfileView,
    LessonBookmarkDetailView,
    LessonBookmarkListView,
    LessonCatalogProgressView,
    LessonFeedbackDetailView,
    LessonProgressDetailView,
    QuizAttemptCreateView,
    RecommendedNextLessonView,
)

urlpatterns = [
    path("achievements/", LearningAchievementListView.as_view(), name="achievement-list"),
    path("bookmarks/", LessonBookmarkListView.as_view(), name="bookmark-list"),
    path("bookmarks/<slug:slug>/", LessonBookmarkDetailView.as_view(), name="bookmark-detail"),
    path("catalog-progress/", LessonCatalogProgressView.as_view(), name="catalog-progress"),
    path("feedback/<slug:slug>/", LessonFeedbackDetailView.as_view(), name="feedback-detail"),
    path("paths/", LearningPathListView.as_view(), name="path-list"),
    path("recommendation/", RecommendedNextLessonView.as_view(), name="recommendation"),
    path("xp/", LearningXpProfileView.as_view(), name="xp-profile"),
    path("progress/<slug:slug>/", LessonProgressDetailView.as_view(), name="progress-detail"),
    path("quiz-attempts/<slug:slug>/", QuizAttemptCreateView.as_view(), name="quiz-attempt-create"),
]
