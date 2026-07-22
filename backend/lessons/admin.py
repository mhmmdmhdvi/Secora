from django.contrib import admin
from django.contrib import messages
from django.db.models import Prefetch
from django.core.exceptions import ValidationError
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404
from django.template.response import TemplateResponse
from django.urls import path, reverse
from django.utils.html import format_html
from django.utils.http import urlencode

from .api.serializers import default_locale, serialize_lesson_revision_detail
from .models import (
    Answer,
    AnswerTranslation,
    Lesson,
    LessonBlock,
    LessonBlockTranslation,
    LessonPrerequisite,
    LessonRevision,
    LessonSection,
    LessonSectionTranslation,
    LessonTranslation,
    MediaAsset,
    Question,
    QuestionTranslation,
    Quiz,
    QuizTranslation,
)
from .services import build_publish_readiness_errors, publish_revision


@admin.action(description="Publish selected draft revisions")
def publish_selected_revisions(modeladmin, request, queryset):
    published = 0
    for revision in queryset:
        try:
            publish_revision(revision.pk, published_by=request.user)
        except ValidationError as exc:
            modeladmin.message_user(
                request,
                f"{revision} was not published: {exc.messages[0]}",
                level="ERROR",
            )
        else:
            published += 1

    if published:
        modeladmin.message_user(request, f"Published {published} revision(s).")


class LessonPrerequisiteInline(admin.TabularInline):
    model = LessonPrerequisite
    fk_name = "lesson"
    extra = 0
    ordering = ("prerequisite__sort_order",)


class LessonRevisionInline(admin.TabularInline):
    model = LessonRevision
    extra = 0
    fields = ("version", "status", "change_summary", "created_by", "published_at")
    readonly_fields = ("published_at",)
    ordering = ("-version",)
    show_change_link = True


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("slug", "status", "difficulty", "sort_order", "estimated_minutes")
    list_filter = ("status", "difficulty")
    search_fields = ("slug", "revisions__translations__title")
    ordering = ("sort_order",)
    inlines = (LessonPrerequisiteInline, LessonRevisionInline)


class LessonTranslationInline(admin.StackedInline):
    model = LessonTranslation
    extra = 0
    fields = ("locale", "status", "title", "summary", "seo_title", "seo_description")
    ordering = ("locale",)


class SectionInline(admin.TabularInline):
    model = LessonSection
    extra = 0
    fields = ("sort_order", "key")
    ordering = ("sort_order",)
    show_change_link = True


class QuizInline(admin.StackedInline):
    model = Quiz
    extra = 0
    fields = ("pass_percentage", "shuffle_questions", "shuffle_answers")
    show_change_link = True


@admin.register(LessonRevision)
class LessonRevisionAdmin(admin.ModelAdmin):
    list_display = (
        "lesson",
        "version",
        "status",
        "created_at",
        "published_at",
        "preview_button",
        "publish_button",
    )
    list_filter = ("status",)
    search_fields = ("lesson__slug", "translations__title")
    readonly_fields = ("created_at", "published_at", "preview_button", "publish_button")
    inlines = (LessonTranslationInline, SectionInline, QuizInline)
    actions = (publish_selected_revisions,)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "<path:object_id>/preview/",
                self.admin_site.admin_view(self.preview_view),
                name="lessons_lessonrevision_preview",
            ),
            path(
                "<path:object_id>/publish/",
                self.admin_site.admin_view(self.publish_view),
                name="lessons_lessonrevision_publish",
            ),
        ]
        return custom_urls + urls

    def preview_view(self, request, object_id):
        revision = get_object_or_404(self.get_preview_queryset(), pk=object_id)
        locale = request.GET.get("locale") or default_locale()
        errors = build_publish_readiness_errors(revision)

        return JsonResponse(
            {
                "version": "v1",
                "preview": True,
                "publishReady": not errors,
                "publishErrors": errors,
                "lesson": serialize_lesson_revision_detail(revision, locale),
            }
        )

    def publish_view(self, request, object_id):
        revision = self.get_object(request, object_id)
        if revision is None:
            return HttpResponseRedirect(reverse("admin:lessons_lessonrevision_changelist"))

        if request.method == "POST":
            try:
                publish_revision(revision.pk, published_by=request.user)
            except ValidationError as exc:
                self.message_user(request, exc.messages[0], level=messages.ERROR)
            else:
                self.message_user(request, f"Published {revision}.", level=messages.SUCCESS)

            return HttpResponseRedirect(
                reverse("admin:lessons_lessonrevision_change", args=(revision.pk,))
            )

        context = {
            **self.admin_site.each_context(request),
            "opts": self.model._meta,
            "original": revision,
            "title": f"Publish {revision}",
            "publish_errors": build_publish_readiness_errors(revision),
        }
        return TemplateResponse(
            request,
            "admin/lessons/lessonrevision/publish_confirmation.html",
            context,
        )

    def get_preview_queryset(self):
        return (
            LessonRevision.objects.select_related("lesson")
            .prefetch_related(
                "translations",
                "lesson__prerequisite_links__prerequisite",
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
        )

    def preview_button(self, obj):
        if obj.pk is None:
            return "-"
        query = urlencode({"locale": default_locale()})
        url = reverse("admin:lessons_lessonrevision_preview", args=(obj.pk,))
        return format_html('<a href="{}?{}">Preview JSON</a>', url, query)

    preview_button.short_description = "Preview"

    def publish_button(self, obj):
        if obj.pk is None:
            return "-"
        url = reverse("admin:lessons_lessonrevision_publish", args=(obj.pk,))
        return format_html('<a class="button" href="{}">Publish</a>', url)

    publish_button.short_description = "Publish"


class SectionTranslationInline(admin.TabularInline):
    model = LessonSectionTranslation
    extra = 0
    fields = ("locale", "title")
    ordering = ("locale",)


class BlockInline(admin.TabularInline):
    model = LessonBlock
    extra = 0
    fields = ("sort_order", "key", "block_type", "media_asset")
    ordering = ("sort_order",)
    show_change_link = True


@admin.register(LessonSection)
class LessonSectionAdmin(admin.ModelAdmin):
    list_display = ("revision", "key", "sort_order")
    list_select_related = ("revision", "revision__lesson")
    ordering = ("revision", "sort_order")
    inlines = (SectionTranslationInline, BlockInline)


class BlockTranslationInline(admin.StackedInline):
    model = LessonBlockTranslation
    extra = 0
    fields = ("locale", "heading", "body", "alt_text")
    ordering = ("locale",)


@admin.register(LessonBlock)
class LessonBlockAdmin(admin.ModelAdmin):
    list_display = ("section", "key", "block_type", "sort_order", "media_asset")
    list_filter = ("block_type",)
    list_select_related = ("section", "section__revision", "section__revision__lesson")
    ordering = ("section", "sort_order")
    inlines = (BlockTranslationInline,)


class QuizTranslationInline(admin.StackedInline):
    model = QuizTranslation
    extra = 0
    fields = ("locale", "title", "instructions")
    ordering = ("locale",)


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 0
    fields = ("sort_order", "key", "question_type", "points")
    ordering = ("sort_order",)
    show_change_link = True


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("revision", "pass_percentage", "shuffle_questions", "shuffle_answers")
    list_select_related = ("revision", "revision__lesson")
    inlines = (QuizTranslationInline, QuestionInline)


class QuestionTranslationInline(admin.StackedInline):
    model = QuestionTranslation
    extra = 0
    fields = ("locale", "prompt", "explanation")
    ordering = ("locale",)


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 0
    fields = ("sort_order", "key", "is_correct")
    ordering = ("sort_order",)
    show_change_link = True


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("quiz", "key", "question_type", "sort_order", "points")
    list_filter = ("question_type",)
    list_select_related = ("quiz", "quiz__revision", "quiz__revision__lesson")
    ordering = ("quiz", "sort_order")
    inlines = (QuestionTranslationInline, AnswerInline)


class AnswerTranslationInline(admin.StackedInline):
    model = AnswerTranslation
    extra = 0
    fields = ("locale", "text")
    ordering = ("locale",)


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ("question", "key", "sort_order", "is_correct")
    list_filter = ("is_correct",)
    list_select_related = ("question", "question__quiz")
    ordering = ("question", "sort_order")
    inlines = (AnswerTranslationInline,)


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ("key", "mime_type", "width", "height", "byte_size", "updated_at")
    search_fields = ("key", "url", "checksum")


admin.site.register(LessonTranslation)
admin.site.register(LessonSectionTranslation)
admin.site.register(LessonBlockTranslation)
admin.site.register(QuizTranslation)
admin.site.register(QuestionTranslation)
admin.site.register(AnswerTranslation)
