from datetime import datetime, timezone


def serialize(doc):
    return doc


def now():
    return datetime.now(timezone.utc).isoformat()


def clean_text(value, limit=3000):
    if not isinstance(value, str):
        return ""

    return value.strip()[:limit]
