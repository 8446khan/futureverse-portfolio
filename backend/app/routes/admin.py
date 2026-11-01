from functools import wraps

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.db import all_items, find_one, insert, get, update, delete, count, upsert_by
from app.utils import clean_text, now

admin = Blueprint("admin", __name__)


def admin_only(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        user = get("users", identity)

        if not user or user.get("role") != "admin":
            return jsonify({"error": "Admin access required"}), 403

        return fn(*args, **kwargs)

    return wrapper


def save_item(data, fields, existing=None):
    item = {}

    for field in fields:
        if field in data:
            value = data[field]

            if isinstance(value, str):
                value = clean_text(value, 2000)

            item[field] = value

    item["updated_at"] = now()

    if "published" not in item:
        if existing is not None:
            item["published"] = existing.get("published", True)
        else:
            item["published"] = True

    return item


def valid_item_data(data):
    if not isinstance(data, dict):
        return False

    return True


def register_crud(table, fields, slug):

    @admin.get(f"/{slug}", endpoint=f"{slug}_get_all")
    @admin_only
    def get_all():
        return jsonify(all_items(table))

    @admin.post(f"/{slug}", endpoint=f"{slug}_create")
    @admin_only
    def create():
        data = request.get_json(silent=True) or {}

        if not valid_item_data(data):
            return jsonify({"error": "Invalid request data"}), 400

        item = save_item(data, fields)

        if not item.get("title") and not item.get("name"):
            return jsonify({"error": "A title or name is required"}), 400

        item["created_at"] = now()

        return jsonify(insert(table, item)), 201

    @admin.put(f"/{slug}/<item_id>", endpoint=f"{slug}_update")
    @admin_only
    def edit(item_id):
        if not item_id.isdigit():
            return jsonify({"error": "Not found"}), 404

        existing = get(table, item_id)

        if not existing:
            return jsonify({"error": "Not found"}), 404

        data = request.get_json(silent=True) or {}

        if not valid_item_data(data):
            return jsonify({"error": "Invalid request data"}), 400

        changes = save_item(data, fields, existing)

        result = update(table, item_id, changes)

        return jsonify(result), 200

    @admin.delete(f"/{slug}/<item_id>", endpoint=f"{slug}_delete")
    @admin_only
    def remove(item_id):
        if not item_id.isdigit():
            return jsonify({"error": "Not found"}), 404

        if not delete(table, item_id):
            return jsonify({"error": "Not found"}), 404

        return jsonify({"success": True}), 200


register_crud(
    "projects",
    [
        "title",
        "category",
        "description",
        "technologies",
        "github_url",
        "demo_url",
        "image_url",
        "featured",
        "published",
    ],
    "projects",
)

register_crud(
    "skills", ["name", "category", "level", "icon", "order", "published"], "skills"
)

register_crud(
    "experience",
    [
        "title",
        "organization",
        "description",
        "start_date",
        "end_date",
        "type",
        "published",
    ],
    "experience",
)

register_crud(
    "certifications",
    ["name", "issuer", "date", "credential_url", "published"],
    "certifications",
)


@admin.get("/messages")
@admin_only
def messages():
    return jsonify(all_items("messages"))


@admin.patch("/messages/<item_id>")
@admin_only
def update_message(item_id):
    if not item_id.isdigit():
        return jsonify({"error": "Not found"}), 404

    message = get("messages", item_id)

    if not message:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json(silent=True) or {}

    read_value = data.get("read", True)

    if not isinstance(read_value, bool):
        return jsonify({"error": "Read status must be true or false"}), 400

    update("messages", item_id, {"read": read_value})

    return jsonify({"success": True}), 200


@admin.delete("/messages/<item_id>")
@admin_only
def delete_message(item_id):
    if not item_id.isdigit():
        return jsonify({"error": "Not found"}), 404

    if not delete("messages", item_id):
        return jsonify({"error": "Not found"}), 404

    return jsonify({"success": True}), 200


@admin.get("/analytics")
@admin_only
def analytics():
    all_views = all_items("page_views")

    views = [item for item in all_views if item.get("kind") == "page"]

    resumes = count("page_views", kind="resume")
    unread = count("messages", read=False)
    projects = count("projects")

    recent = sorted(
        all_views, key=lambda item: item.get("created_at", ""), reverse=True
    )[:100]

    by_page = {}

    for item in recent:
        page = item.get("page", "home")
        by_page[page] = by_page.get(page, 0) + 1

    return (
        jsonify(
            {
                "total_views": len(views),
                "resume_downloads": resumes,
                "unread_messages": unread,
                "projects": projects,
                "recent_views": [
                    {"page": page, "views": total} for page, total in by_page.items()
                ],
            }
        ),
        200,
    )


@admin.get("/profile")
@admin_only
def get_profile():
    profile = find_one("profile", key="main") or {}

    profile.pop("id", None)

    return jsonify(profile), 200


@admin.put("/profile")
@admin_only
def update_profile():
    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request data"}), 400

    allowed = [
        "name",
        "headline",
        "bio",
        "email",
        "location",
        "github",
        "linkedin",
        "website",
        "summary",
    ]

    payload = {}

    for field in allowed:
        if field in data:
            max_length = 2000 if field in ["bio", "summary"] else 300
            payload[field] = clean_text(data[field], max_length)

    upsert_by("profile", "key", "main", {"key": "main", **payload})

    return jsonify({"success": True}), 200
