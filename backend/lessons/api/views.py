from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from lessons.cache import (
    catalog_cache_key,
    detail_cache_key,
    get_cached_response,
    set_cached_response,
)
from lessons.models import Lesson, LessonBlock, LessonRevision, LessonSection

from .serializers import (
    LocaleQuerySerializer,
    serialize_catalog_lesson,
    serialize_lesson_detail,
)


class LessonCatalogView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        locale = validated_locale(request)
        cache_key = catalog_cache_key(locale)
        payload = get_cached_response(cache_key)
        if payload is not None:
            return Response(payload)

        lessons = catalog_queryset()
        payload = {
            "version": "v1",
            "locale": locale,
            "results": [
                serialize_catalog_lesson(lesson, locale) for lesson in lessons
            ],
        }
        set_cached_response(cache_key, payload)
        return Response(payload)


class LessonDetailView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request, slug):
        locale = validated_locale(request)
        revision_marker = get_object_or_404(published_revision_marker_queryset(slug))
        cache_key = detail_cache_key(slug, locale, revision_marker.pk)
        payload = get_cached_response(cache_key)
        if payload is not None:
            return Response(payload)

        lesson = get_object_or_404(detail_queryset(), slug=slug)
        payload = {
            "version": "v1",
            "lesson": serialize_lesson_detail(lesson, locale),
        }
        set_cached_response(cache_key, payload)
        return Response(payload)


def validated_locale(request):
    serializer = LocaleQuerySerializer(data=request.query_params)
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data["locale"]


def catalog_queryset():
    return (
        Lesson.objects.filter(
            status=Lesson.Status.PUBLISHED,
            revisions__status=LessonRevision.Status.PUBLISHED,
        )
        .distinct()
        .prefetch_related(published_revision_prefetch())
        .order_by("sort_order", "slug")
    )


def detail_queryset():
    return (
        Lesson.objects.filter(
            status=Lesson.Status.PUBLISHED,
            revisions__status=LessonRevision.Status.PUBLISHED,
        )
        .distinct()
        .prefetch_related(
            "prerequisite_links__prerequisite",
            published_revision_prefetch(
                queryset=LessonRevision.objects.filter(
                    status=LessonRevision.Status.PUBLISHED
                )
                .select_related("quiz")
                .prefetch_related(
                    "translations",
                    Prefetch(
                        "sections",
                        queryset=LessonSection.objects.prefetch_related(
                            "translations",
                            Prefetch(
                                "blocks",
                                queryset=LessonBlock.objects.select_related(
                                    "media_asset"
                                ).prefetch_related("translations"),
                            ),
                        ),
                    ),
                    "quiz__translations",
                    "quiz__questions__translations",
                    "quiz__questions__answers__translations",
                )
            ),
        )
    )


def published_revision_marker_queryset(slug):
    return LessonRevision.objects.filter(
        lesson__slug=slug,
        lesson__status=Lesson.Status.PUBLISHED,
        status=LessonRevision.Status.PUBLISHED,
    ).only("id")


def published_revision_prefetch(queryset=None):
    return Prefetch(
        "revisions",
        queryset=queryset
        or LessonRevision.objects.filter(
            status=LessonRevision.Status.PUBLISHED
        ).prefetch_related("translations"),
    )
