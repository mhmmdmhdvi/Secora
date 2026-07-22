from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator


validate_locale = RegexValidator(
    regex=r"^[a-z]{2,3}(?:-[A-Z]{2})?$",
    message="Use a locale such as 'fa', 'en', or 'en-US'.",
)

validate_registry_key = RegexValidator(
    regex=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    message="Use a lowercase kebab-case registry key.",
)


BLOCK_CONFIG_RULES = {
    "narrative": (set(), {"tone"}),
    "callout": (set(), {"tone", "icon", "action_path"}),
    "code": ({"language"}, {"filename", "highlight_lines"}),
    "terminal": (set(), {"prompt", "language"}),
    "image": (set(), {"caption_position"}),
    "simulation": ({"registry_key"}, {"initial_state"}),
}


def validate_block_config(block_type, config):
    if not isinstance(config, dict):
        raise ValidationError({"config": "Block configuration must be an object."})

    required, optional = BLOCK_CONFIG_RULES.get(block_type, (None, None))
    if required is None:
        raise ValidationError({"block_type": "Unsupported block type."})

    keys = set(config)
    missing = required - keys
    unknown = keys - required - optional
    errors = []
    if missing:
        errors.append(f"Missing configuration keys: {', '.join(sorted(missing))}.")
    if unknown:
        errors.append(f"Unknown configuration keys: {', '.join(sorted(unknown))}.")
    if errors:
        raise ValidationError({"config": errors})

    registry_key = config.get("registry_key")
    if registry_key:
        validate_registry_key(registry_key)
