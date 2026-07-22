from django.conf import settings
from django.core.cache import cache

CATALOG_VERSION_KEY = "lessons:v1:catalog:version"
DEFAULT_PUBLISHED_CACHE_SECONDS = 60 * 15


def published_cache_timeout():
    return getattr(
        settings,
        "LESSON_PUBLISHED_CACHE_SECONDS",
        DEFAULT_PUBLISHED_CACHE_SECONDS,
    )


def catalog_cache_key(locale):
    return f"lessons:v1:catalog:{locale}:v{catalog_cache_version()}"


def detail_cache_key(slug, locale, revision_id):
    return f"lessons:v1:detail:{slug}:{locale}:r{revision_id}"


def get_cached_response(key):
    return cache.get(key)


def set_cached_response(key, payload):
    cache.set(key, payload, timeout=published_cache_timeout())


def invalidate_published_lesson_cache(slug, revision_id=None, locales=None):
    bump_catalog_cache_version()

    if revision_id is None:
        return

    for locale in locales or getattr(settings, "LESSON_REQUIRED_LOCALES", ()):
        cache.delete(detail_cache_key(slug, locale, revision_id))


def catalog_cache_version():
    version = cache.get(CATALOG_VERSION_KEY)
    if version is None:
        cache.add(CATALOG_VERSION_KEY, 1, timeout=None)
        return cache.get(CATALOG_VERSION_KEY, 1)
    return version


def bump_catalog_cache_version():
    try:
        cache.incr(CATALOG_VERSION_KEY)
    except ValueError:
        cache.add(CATALOG_VERSION_KEY, 2, timeout=None)
