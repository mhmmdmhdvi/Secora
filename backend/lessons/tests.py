from django.core.exceptions import ValidationError
from django.core.cache import cache
from django.test import SimpleTestCase

from .api.serializers import (
    LocaleQuerySerializer,
    serialize_answer,
    serialize_catalog_lesson,
    serialize_lesson_revision_detail,
)
from .cache import (
    catalog_cache_key,
    detail_cache_key,
    invalidate_published_lesson_cache,
)
from .models import Lesson, LessonBlock, LessonRevision, Question, TranslationStatus
from .seed_content.sql_injection_guide import GUIDE as SQL_INJECTION_GUIDE_SEED
from .seed_content.sql_injection import LESSON as SQL_INJECTION_SEED
from .seed_content.cross_site_script_inclusion import LESSON as XSSI_SEED
from .seed_content.cross_site_script_inclusion_guide import GUIDE as XSSI_GUIDE_SEED
from .seed_content.cross_site_scripting import GUIDE as XSS_GUIDE_SEED
from .seed_content.cross_site_scripting import LESSON as XSS_SEED
from .seed_content.reflected_xss import GUIDE as REFLECTED_XSS_GUIDE_SEED
from .seed_content.reflected_xss import GUIDE_TRANSLATIONS as REFLECTED_XSS_GUIDE_TRANSLATIONS
from .seed_content.reflected_xss import LESSON as REFLECTED_XSS_SEED
from .seed_content.reflected_xss import LESSON_TRANSLATIONS as REFLECTED_XSS_TRANSLATIONS
from .seed_content.dom_based_xss import LESSON as DOM_BASED_XSS_SEED
from .services import build_publish_readiness_errors, validate_revision_ready_for_publish
from .validators import validate_block_config, validate_locale


class RelatedList:
    def __init__(self, *items):
        self.items = items

    def all(self):
        return self.items


class Stub:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)


class BlockStub(Stub):
    def clean(self):
        return None


class LocaleValidationTests(SimpleTestCase):
    def test_accepts_supported_locale_shapes(self):
        for locale in ("fa", "en", "en-US"):
            with self.subTest(locale=locale):
                validate_locale(locale)

    def test_rejects_path_like_locale(self):
        with self.assertRaises(ValidationError):
            validate_locale("../../fa")


class BlockConfigValidationTests(SimpleTestCase):
    def test_code_block_requires_language(self):
        with self.assertRaises(ValidationError) as context:
            validate_block_config(LessonBlock.Type.CODE, {})

        self.assertIn("Missing configuration keys: language.", context.exception.messages)

    def test_simulation_registry_key_must_be_allow_list_shape(self):
        with self.assertRaises(ValidationError):
            validate_block_config(
                LessonBlock.Type.SIMULATION,
                {"registry_key": "../../ArbitraryComponent"},
            )

    def test_rejects_unknown_configuration(self):
        with self.assertRaises(ValidationError) as context:
            validate_block_config(
                LessonBlock.Type.NARRATIVE,
                {"executable": "alert(1)"},
            )

        self.assertIn("Unknown configuration keys: executable.", context.exception.messages)

    def test_accepts_typed_configuration(self):
        validate_block_config(
            LessonBlock.Type.CODE,
            {"language": "python", "filename": "safe_query.py"},
        )

    def test_image_block_requires_relational_media_asset(self):
        block = LessonBlock(
            section_id=1,
            key="diagram",
            block_type=LessonBlock.Type.IMAGE,
            sort_order=1,
            config={},
        )

        with self.assertRaises(ValidationError) as context:
            block.clean()

        self.assertIn("media_asset", context.exception.message_dict)


class RevisionValidationTests(SimpleTestCase):
    def test_published_revision_requires_audit_fields(self):
        revision = LessonRevision(
            lesson_id=1,
            version=1,
            status=LessonRevision.Status.PUBLISHED,
            created_by_id=1,
        )

        with self.assertRaises(ValidationError):
            revision.clean()


class PublishReadinessTests(SimpleTestCase):
    def test_requires_ready_lesson_translations_for_all_locales(self):
        revision = Stub(
            status=LessonRevision.Status.DRAFT,
            lesson=Stub(status=Lesson.Status.DRAFT),
            translations=RelatedList(
                Stub(locale="fa", status=TranslationStatus.READY, title="SQL", summary="Summary"),
            ),
            sections=RelatedList(),
            quiz=None,
        )

        errors = build_publish_readiness_errors(revision, required_locales=("fa", "en"))

        self.assertIn("Missing en translation.", errors["translations"])

    def test_requires_section_block_and_quiz_content(self):
        block = complete_block()
        section = Stub(
            key="intro",
            translations=complete_section_translations(),
            blocks=RelatedList(block),
        )
        quiz = Stub(
            translations=complete_quiz_translations(),
            questions=RelatedList(),
        )
        revision = publishable_revision(sections=RelatedList(section), quiz=quiz)

        errors = build_publish_readiness_errors(revision, required_locales=("fa", "en"))

        self.assertIn("A quiz needs at least one question.", errors["quiz.questions"])

    def test_valid_revision_passes_readiness_check(self):
        revision = publishable_revision()

        validate_revision_ready_for_publish(revision, required_locales=("fa", "en"))

    def test_single_answer_question_requires_exactly_one_correct_answer(self):
        question = complete_question(
            question_type=Question.Type.SINGLE,
            answers=RelatedList(
                complete_answer("a", is_correct=True),
                complete_answer("b", is_correct=True),
            ),
        )
        revision = publishable_revision(
            quiz=complete_quiz(questions=RelatedList(question)),
        )

        errors = build_publish_readiness_errors(revision, required_locales=("fa", "en"))

        self.assertIn(
            "Single-answer questions need exactly one correct answer.",
            errors["quiz.questions.question"],
        )


class LessonApiSerializerTests(SimpleTestCase):
    def test_catalog_serializer_returns_requested_locale_translation(self):
        lesson = Stub(
            slug="sql-injection",
            difficulty=Lesson.Difficulty.BEGINNER,
            sort_order=1,
            estimated_minutes=15,
            simulation_key="sql-injection",
            revisions=RelatedList(
                Stub(
                    pk=10,
                    status=LessonRevision.Status.PUBLISHED,
                    version=2,
                    published_at=None,
                    translations=RelatedList(
                        Stub(locale="fa", title="SQL FA", summary="Summary FA"),
                        Stub(locale="en", title="SQL EN", summary="Summary EN"),
                    ),
                )
            ),
        )

        payload = serialize_catalog_lesson(lesson, "en")

        self.assertEqual(payload["locale"], "en")
        self.assertEqual(payload["title"], "SQL EN")
        self.assertEqual(payload["revision"]["version"], 2)
        self.assertEqual(payload["revision"]["status"], LessonRevision.Status.PUBLISHED)

    def test_locale_query_rejects_invalid_locale_shape(self):
        serializer = LocaleQuerySerializer(data={"locale": "../../fa"})

        self.assertFalse(serializer.is_valid())
        self.assertIn("locale", serializer.errors)

    def test_revision_preview_serializer_handles_missing_quiz(self):
        lesson = Stub(
            slug="sql-injection",
            status=Lesson.Status.DRAFT,
            difficulty=Lesson.Difficulty.BEGINNER,
            sort_order=1,
            estimated_minutes=15,
            simulation_key="",
            prerequisite_links=RelatedList(),
        )
        revision = Stub(
            pk=10,
            lesson=lesson,
            status=LessonRevision.Status.DRAFT,
            version=1,
            published_at=None,
            translations=RelatedList(),
            sections=RelatedList(),
        )

        payload = serialize_lesson_revision_detail(revision, "fa")

        self.assertEqual(payload["revision"]["status"], LessonRevision.Status.DRAFT)
        self.assertEqual(payload["locale"], "fa")
        self.assertIsNone(payload["quiz"])

    def test_answer_serializer_exposes_correctness_for_current_client_quiz(self):
        answer = Stub(
            key="false",
            sort_order=2,
            is_correct=True,
            translations=RelatedList(Stub(locale="en", text="False")),
        )

        payload = serialize_answer(answer, "en")

        self.assertTrue(payload["isCorrect"])


class LessonCacheTests(SimpleTestCase):
    def setUp(self):
        cache.clear()

    def test_detail_cache_key_includes_slug_locale_and_revision(self):
        key = detail_cache_key("sql-injection", "fa", 42)

        self.assertEqual(key, "lessons:v1:detail:sql-injection:fa:r42")

    def test_publish_invalidation_bumps_catalog_cache_key_version(self):
        before = catalog_cache_key("fa")

        invalidate_published_lesson_cache(
            "sql-injection",
            revision_id=42,
            locales=("fa", "en"),
        )
        after = catalog_cache_key("fa")

        self.assertNotEqual(before, after)


class SqlInjectionSeedContentTests(SimpleTestCase):
    def test_seed_matches_existing_interactive_lesson_shape(self):
        self.assertEqual(SQL_INJECTION_SEED["slug"], "sql-injection")
        self.assertEqual(len(SQL_INJECTION_SEED["steps"]), 13)
        self.assertEqual(SQL_INJECTION_SEED["simulation_key"], "sql-injection")
        self.assertEqual(
            SQL_INJECTION_SEED["credentials"]["injection_password"],
            "' or 1=1--",
        )

    def test_seed_matches_existing_quiz_shape(self):
        self.assertEqual(SQL_INJECTION_SEED["quiz"]["pass_percentage"], 100)
        self.assertEqual(len(SQL_INJECTION_SEED["quiz"]["questions"]), 3)
        self.assertTrue(
            SQL_INJECTION_SEED["quiz"]["questions"][2]["answers"][0]["is_correct"]
        )

    def test_seed_keeps_rich_step_content_for_api_parity(self):
        self.assertEqual(SQL_INJECTION_SEED["steps"][0][1]["type"], "strong")
        self.assertEqual(
            SQL_INJECTION_SEED["completion"][-1]["text"],
            " works, let's learn how to protect against this kind of attack.",
        )

    def test_seed_includes_database_backed_guide_content(self):
        self.assertEqual(SQL_INJECTION_GUIDE_SEED["overview"]["title"], "SQL Injection")
        self.assertEqual(SQL_INJECTION_GUIDE_SEED["code_samples"]["items"][0]["title"], "Node")
        self.assertEqual(
            SQL_INJECTION_GUIDE_SEED["code_samples"]["quiz_cta"]["path"],
            "/lessons/sql-injection-quiz",
        )


class XssiSeedContentTests(SimpleTestCase):
    def test_seed_matches_existing_xssi_lesson_shape(self):
        self.assertEqual(XSSI_SEED["slug"], "cross-site-script-inclusion")
        self.assertEqual(len(XSSI_SEED["steps"]), 9)
        self.assertEqual(XSSI_SEED["total_steps"], 10)
        self.assertEqual(XSSI_SEED["final_step"], 9)

    def test_seed_includes_xssi_guide_and_quiz(self):
        self.assertEqual(
            XSSI_GUIDE_SEED["overview"]["title"],
            "Cross-Site Script Inclusion (XSSI)",
        )
        self.assertEqual(len(XSSI_SEED["quiz"]["questions"]), 2)


class XssSeedContentTests(SimpleTestCase):
    def test_seed_matches_completed_xss_lesson_shape(self):
        self.assertEqual(XSS_SEED["slug"], "cross-site-scripting")
        self.assertEqual(XSS_SEED["simulation_key"], "cross-site-scripting")
        self.assertEqual(len(XSS_SEED["steps"]), 7)
        self.assertEqual(XSS_SEED["total_steps"], 7)
        self.assertEqual(XSS_SEED["final_step"], 6)

    def test_seed_includes_xss_guide_and_quiz(self):
        self.assertEqual(XSS_GUIDE_SEED["overview"]["title"], "Cross-Site Scripting")
        self.assertEqual(XSS_GUIDE_SEED["code_samples"]["items"][0]["title"], "Node")
        self.assertEqual(len(XSS_SEED["quiz"]["questions"]), 2)


class ReflectedXssSeedContentTests(SimpleTestCase):
    def test_seed_matches_reflected_xss_lesson_shape(self):
        self.assertEqual(REFLECTED_XSS_SEED["slug"], "reflected-xss")
        self.assertEqual(REFLECTED_XSS_SEED["simulation_key"], "reflected-xss")
        self.assertEqual(len(REFLECTED_XSS_SEED["steps"]), 14)
        self.assertEqual(REFLECTED_XSS_SEED["total_steps"], 14)
        self.assertEqual(REFLECTED_XSS_SEED["final_step"], 13)

    def test_seed_includes_reflected_xss_visual_scene_data(self):
        simulation = REFLECTED_XSS_SEED["simulation"]

        self.assertEqual(simulation["site"]["url"], "www.welp.com")
        self.assertEqual(simulation["scenes"]["12"]["type"], "server-log")
        self.assertEqual(len(simulation["logs"]["lines"]), 12)
        self.assertEqual(len(REFLECTED_XSS_SEED["quiz"]["questions"]), 3)

    def test_seed_includes_reflected_xss_guide_and_quiz_cta(self):
        self.assertEqual(REFLECTED_XSS_GUIDE_SEED["overview"]["title"], "Reflected XSS")
        self.assertEqual(REFLECTED_XSS_GUIDE_SEED["quiz_cta"]["path"], "/lessons/reflected-xss-quiz")
        self.assertEqual(
            REFLECTED_XSS_GUIDE_SEED["protection"]["sections"][0]["table"]["headings"],
            ["Character", "Encoding"],
        )

    def test_seed_includes_reflected_xss_persian_steps(self):
        self.assertIn("fa", REFLECTED_XSS_TRANSLATIONS)
        self.assertEqual(len(REFLECTED_XSS_TRANSLATIONS["fa"]["steps"]), 14)
        self.assertIn(
            "XSS بازتابی",
            REFLECTED_XSS_TRANSLATIONS["fa"]["steps"][1][0]["text"],
        )

    def test_seed_includes_reflected_xss_persian_guide_and_quiz(self):
        self.assertIn("fa", REFLECTED_XSS_GUIDE_TRANSLATIONS)
        self.assertEqual(
            REFLECTED_XSS_GUIDE_TRANSLATIONS["fa"]["overview"]["title"],
            "XSS بازتابی",
        )
        self.assertEqual(
            REFLECTED_XSS_TRANSLATIONS["fa"]["quiz"]["questions"][2]["answers"][0]["text"],
            "نادرست",
        )


class DomBasedXssSeedContentTests(SimpleTestCase):
    def test_seed_matches_dom_based_xss_lesson_shape(self):
        self.assertEqual(DOM_BASED_XSS_SEED["slug"], "dom-based-xss")
        self.assertEqual(DOM_BASED_XSS_SEED["simulation_key"], "dom-based-xss")
        self.assertEqual(len(DOM_BASED_XSS_SEED["steps"]), 9)
        self.assertEqual(DOM_BASED_XSS_SEED["total_steps"], 9)
        self.assertEqual(DOM_BASED_XSS_SEED["final_step"], 8)

    def test_seed_includes_dom_based_xss_visual_scene_data(self):
        simulation = DOM_BASED_XSS_SEED["simulation"]

        self.assertEqual(simulation["site"]["url"], "www.chinterest.com")
        self.assertEqual(simulation["code"]["header"], "Dangerous use of innerHTML")
        self.assertEqual(simulation["scenes"]["6"]["type"], "mal-payload")
        self.assertIn("window.location", simulation["attack"]["payload_url"])
        self.assertEqual(len(DOM_BASED_XSS_SEED["quiz"]["questions"]), 1)


def publishable_revision(sections=None, quiz=None):
    if sections is None:
        sections = RelatedList(
            Stub(
                key="intro",
                translations=complete_section_translations(),
                blocks=RelatedList(complete_block()),
            )
        )

    if quiz is None:
        quiz = complete_quiz()

    return Stub(
        status=LessonRevision.Status.DRAFT,
        lesson=Stub(status=Lesson.Status.DRAFT),
        translations=RelatedList(
            Stub(locale="fa", status=TranslationStatus.READY, title="SQL", summary="Summary"),
            Stub(locale="en", status=TranslationStatus.READY, title="SQL", summary="Summary"),
        ),
        sections=sections,
        quiz=quiz,
    )


def complete_block():
    return BlockStub(
        key="intro-text",
        block_type=LessonBlock.Type.NARRATIVE,
        translations=RelatedList(
            Stub(locale="fa", body="Matn"),
            Stub(locale="en", body="Body"),
        ),
    )


def complete_section_translations():
    return RelatedList(
        Stub(locale="fa", title="Intro FA"),
        Stub(locale="en", title="Intro"),
    )


def complete_quiz(questions=None):
    return Stub(
        translations=complete_quiz_translations(),
        questions=questions or RelatedList(complete_question()),
    )


def complete_quiz_translations():
    return RelatedList(
        Stub(locale="fa", title="Quiz FA"),
        Stub(locale="en", title="Quiz"),
    )


def complete_question(question_type=Question.Type.SINGLE, answers=None):
    return Stub(
        key="question",
        question_type=question_type,
        translations=RelatedList(
            Stub(locale="fa", prompt="Question FA?"),
            Stub(locale="en", prompt="Question?"),
        ),
        answers=answers
        or RelatedList(
            complete_answer("a", is_correct=True),
            complete_answer("b", is_correct=False),
        ),
    )


def complete_answer(key, is_correct):
    return Stub(
        key=key,
        is_correct=is_correct,
        translations=RelatedList(
            Stub(locale="fa", text="Answer FA"),
            Stub(locale="en", text="Answer"),
        ),
    )
