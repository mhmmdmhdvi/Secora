from django.urls import path

from .views import LessonCatalogView, LessonDetailView


app_name = "lessons_api"

urlpatterns = [
    path("", LessonCatalogView.as_view(), name="catalog"),
    path("<slug:slug>/", LessonDetailView.as_view(), name="detail"),
]
