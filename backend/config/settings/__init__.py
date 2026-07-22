"""Development settings are the default for local management commands.

Deployments must set DJANGO_SETTINGS_MODULE=config.settings.production.
"""

from .development import *  # noqa: F403
