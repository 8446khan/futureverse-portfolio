import re
import requests
import smtplib

from email.message import EmailMessage
from flask import Blueprint, jsonify, request, current_app
from requests.exceptions import RequestException

from app.db import all_items, find_one, insert, get
from app.utils import clean_text, now

api = Blueprint("api", __name__)


def get_json():
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else None


def collection(name):
    return all_items(name)


def public_list(name, sort_field="created_at"):
    return [
        item
        for item in all_items(name, sort_field)
        if item.get("published", True) is not False
    ]


def valid_email(email):
    if not isinstance(email, str) or len(email) > 200:
        return False

    return bool(re.fullmatch(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", email))


# ==============================
# EMAIL CONFIGURATION
# ==============================


def send_contact_email(name, sender_email, subject, message):
    recipient = "khanshoaiburrhman@gmail.com"

    smtp_username = current_app.config.get("MAIL_USERNAME")
    smtp_password = current_app.config.get("MAIL_PASSWORD")

    if not smtp_username or not smtp_password:
        raise RuntimeError("Gmail SMTP credentials are not configured.")

    email_message = EmailMessage()

    email_message["Subject"] = f"Portfolio Contact: {subject}"
    email_message["From"] = smtp_username
    email_message["To"] = recipient
    email_message["Reply-To"] = sender_email

    email_message.set_content(f"""
New contact form submission from your portfolio.

Name: {name}
Email: {sender_email}
Subject: {subject}

Message:
{message}
""")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as server:

        server.login(smtp_username, smtp_password)
        server.send_message(email_message)


# ==============================
# HEALTH CHECK
# ==============================


@api.get("/health")
def health():
    try:
        from app.db import get_db

        get_db().execute("SELECT 1")

        return jsonify({"status": "ok", "database": "SQLite connected"}), 200

    except Exception:
        current_app.logger.exception("Database health check failed")

        return jsonify({"status": "degraded", "database": "unavailable"}), 503


# ==============================
# PROFILE
# ==============================


@api.get("/profile")
def profile():
    doc = find_one("profile", key="main") or {
        "name": "Your Name",
        "headline": "Building the future with technology",
        "bio": "Technology enthusiast exploring software, data and AI.",
        "email": "khanshoaiburrhman@gmail.com",
        "location": "Your City",
        "github": "",
        "linkedin": "",
        "website": "",
        "summary": "Curious mind. Creative thinker.",
    }

    doc.pop("id", None)
    doc.pop("password_hash", None)

    return jsonify(doc), 200


# ==============================
# PROJECTS
# ==============================


@api.get("/projects")
def projects():
    docs = public_list("projects")

    category = clean_text(request.args.get("category"), 100)

    if category and category != "All":
        docs = [item for item in docs if item.get("category") == category]

    docs.sort(
        key=lambda item: (bool(item.get("featured")), str(item.get("created_at", ""))),
        reverse=True,
    )

    return jsonify(docs), 200


@api.get("/projects/<project_id>")
def project(project_id):
    if not project_id.isdigit():
        return jsonify({"error": "Project not found"}), 404

    doc = get("projects", project_id)

    if not doc or doc.get("published", True) is False:
        return jsonify({"error": "Project not found"}), 404

    return jsonify(doc), 200


# ==============================
# SKILLS
# ==============================


@api.get("/skills")
def skills():
    return jsonify(public_list("skills", "order")), 200


# ==============================
# EXPERIENCE
# ==============================


@api.get("/experience")
def experience():
    return jsonify(public_list("experience", "start_date")), 200


# ==============================
# CERTIFICATIONS
# ==============================


@api.get("/certifications")
def certifications():
    return jsonify(public_list("certifications", "date")), 200


# ==============================
# CONTACT FORM + EMAIL
# ==============================


@api.post("/contact")
def contact():
    data = get_json()

    if data is None:
        return jsonify({"error": "Invalid request data"}), 400

    # Honeypot spam protection
    if data.get("website"):
        return jsonify({"success": True}), 200

    name = clean_text(data.get("name"), 100)
    email = clean_text(data.get("email"), 200)
    subject = clean_text(data.get("subject"), 200)
    message = clean_text(data.get("message"), 4000)

    if not all([name, email, subject, message]):
        return jsonify({"error": "All fields are required."}), 400

    if not valid_email(email):
        return jsonify({"error": "Please provide a valid email address."}), 400

    # Save contact message in SQLite
    insert(
        "messages",
        {
            "name": name,
            "email": email,
            "subject": subject,
            "message": message,
            "read": False,
            "created_at": now(),
        },
    )

    # Send email notification
    try:
        send_contact_email(name, email, subject, message)

        return (
            jsonify(
                {
                    "success": True,
                    "email_sent": True,
                    "message": "Thank you! Your message has been sent successfully.",
                }
            ),
            201,
        )

    except Exception:
        current_app.logger.exception("Failed to send portfolio contact email")

        return (
            jsonify(
                {
                    "success": True,
                    "email_sent": False,
                    "message": "Your message was saved, but email delivery failed. Please try again later.",
                }
            ),
            201,
        )


# ==============================
# ANALYTICS
# ==============================


@api.post("/analytics/view")
def track_view():
    data = get_json()

    if data is None:
        return jsonify({"error": "Invalid request data"}), 400

    page = clean_text(data.get("page", "home"), 80) or "home"

    insert("page_views", {"page": page, "kind": "page", "created_at": now()})

    return jsonify({"success": True}), 201


@api.post("/analytics/resume")
def track_resume():
    insert("page_views", {"page": "resume", "kind": "resume", "created_at": now()})

    return jsonify({"success": True}), 201


# ==============================
# GITHUB
# ==============================


@api.get("/github")
def github():
    username = current_app.config.get("GITHUB_USERNAME", "")

    if not username:
        return jsonify({"repositories": [], "configured": False}), 200

    if not re.fullmatch(r"[A-Za-z0-9-]{1,39}", username):
        current_app.logger.warning("Invalid GitHub username configuration")

        return jsonify({"repositories": [], "configured": False}), 200

    try:
        response = requests.get(
            f"https://api.github.com/users/{username}/repos",
            params={"sort": "updated", "per_page": 8},
            timeout=(3, 8),
            headers={
                "Accept": "application/vnd.github+json",
                "User-Agent": "Futureverse-Portfolio",
            },
        )

        response.raise_for_status()

        repositories = response.json()

        if not isinstance(repositories, list):
            raise ValueError("Unexpected GitHub API response")

        repos = []

        for repo in repositories:
            if not isinstance(repo, dict):
                continue

            name = repo.get("name")
            url = repo.get("html_url")

            if not isinstance(name, str) or not isinstance(url, str):
                continue

            if not url.startswith("https://github.com/"):
                continue

            repos.append(
                {
                    "name": name,
                    "description": repo.get("description"),
                    "url": url,
                    "language": repo.get("language"),
                    "stars": repo.get("stargazers_count", 0),
                    "forks": repo.get("forks_count", 0),
                }
            )

        return jsonify({"repositories": repos, "configured": True}), 200

    except (RequestException, ValueError) as error:
        current_app.logger.warning("GitHub API request failed: %s", error)

        return (
            jsonify(
                {
                    "repositories": [],
                    "configured": True,
                    "available": False,
                    "message": "GitHub feed temporarily unavailable",
                }
            ),
            200,
        )


# ==============================
# AI ASSISTANT
# ==============================


@api.post("/assistant")
def assistant():
    data = get_json()

    if data is None:
        return jsonify({"error": "Invalid request data"}), 400

    question = clean_text(data.get("question"), 500).lower()

    if not question:
        return jsonify({"error": "Please enter a question."}), 400

    profile_data = find_one("profile", key="main") or {}

    skills_list = [
        item.get("name") for item in public_list("skills") if item.get("name")
    ]

    projects_list = [
        item.get("title") for item in public_list("projects") if item.get("title")
    ]

    if any(word in question for word in ["skill", "technology", "tech stack"]):
        answer = "The published skills include: " + (
            ", ".join(skills_list) if skills_list else "Skills are being updated."
        )

    elif any(word in question for word in ["project", "work", "built"]):
        answer = "Featured projects include: " + (
            ", ".join(projects_list) if projects_list else "Projects are being updated."
        )

    elif any(word in question for word in ["contact", "email", "hire"]):
        answer = (
            "You can get in touch at "
            + profile_data.get("email", "khanshoaiburrhman@gmail.com")
            + "."
        )

    elif any(word in question for word in ["about", "who", "background"]):
        answer = profile_data.get(
            "bio", "I'm a technology enthusiast building useful digital experiences."
        )

    else:
        answer = (
            "I can help with questions about the portfolio owner's "
            "background, skills, projects and contact details. "
            "Try asking: What skills do you know?"
        )

    return jsonify({"answer": answer}), 200
