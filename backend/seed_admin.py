import os

from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

from app import create_app
from app.db import find_one, insert, update, all_items
from app.utils import now

load_dotenv()

app = create_app()


def create_admin():
    email = os.getenv("ADMIN_EMAIL", "").strip().lower()
    password = os.getenv("ADMIN_PASSWORD", "")
    reset_password = os.getenv("RESET_ADMIN_PASSWORD", "false").lower() == "true"

    if not email or not password:
        raise SystemExit("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env")

    if len(password) < 12:
        raise SystemExit("Admin password must contain at least 12 characters.")

    existing = find_one("users", email=email)

    if existing:
        if existing.get("role") != "admin":
            raise SystemExit(
                "This email belongs to a non-admin account. "
                "Review the account manually before changing its role."
            )

        if reset_password:
            update(
                "users",
                existing["id"],
                {
                    "password_hash": generate_password_hash(password),
                    "updated_at": now(),
                },
            )

            print("Existing admin password updated.")

        else:
            print("Admin account already exists. Password was not changed.")

    else:
        insert(
            "users",
            {
                "email": email,
                "password_hash": generate_password_hash(password),
                "role": "admin",
                "created_at": now(),
                "updated_at": now(),
            },
        )

        print("Admin account created successfully.")


def seed_portfolio():
    defaults = {
        "profile": [
            {
                "key": "main",
                "name": "Your Name",
                "headline": "Building the future with technology",
                "bio": (
                    "I'm a technology enthusiast exploring software "
                    "development, data and AI. I enjoy solving real-world "
                    "problems and building useful digital experiences."
                ),
                "email": "hello@example.com",
                "location": "Your City",
                "github": "https://github.com/",
                "linkedin": "https://linkedin.com/",
                "summary": "Curious mind. Creative thinker.",
            }
        ],
        "projects": [
            {
                "title": "AI Prediction System",
                "category": "AI / ML",
                "description": (
                    "A machine learning project that explores predictive "
                    "analytics. Replace this sample with your real project details."
                ),
                "technologies": ["Python", "Pandas", "Scikit-learn"],
                "github_url": "https://github.com/",
                "demo_url": "",
                "featured": True,
                "published": True,
            },
            {
                "title": "Data Analytics Dashboard",
                "category": "Data",
                "description": (
                    "An interactive dashboard that turns raw data into "
                    "actionable insights. Replace this sample with your real project details."
                ),
                "technologies": ["Python", "SQL", "Power BI"],
                "github_url": "https://github.com/",
                "demo_url": "",
                "featured": True,
                "published": True,
            },
            {
                "title": "Blockchain Application",
                "category": "Development",
                "description": (
                    "A decentralized application exploring secure "
                    "transactions and distributed ledger technology."
                ),
                "technologies": ["Solidity", "Web3", "JavaScript"],
                "github_url": "https://github.com/",
                "demo_url": "",
                "featured": False,
                "published": True,
            },
        ],
        "skills": [
            {
                "name": name,
                "category": category,
                "level": "Learning",
                "icon": "✦",
                "order": index,
                "published": True,
            }
            for index, (name, category) in enumerate(
                [
                    ("Python", "Programming"),
                    ("JavaScript", "Programming"),
                    ("React", "Frontend"),
                    ("Flask", "Backend"),
                    ("SQLite", "Database"),
                    ("SQL", "Database"),
                    ("Pandas", "Data"),
                    ("Machine Learning", "AI / ML"),
                ]
            )
        ],
        "experience": [
            {
                "title": "Add your education",
                "organization": "Your institution",
                "description": ("Update this entry from the admin dashboard."),
                "start_date": "2024",
                "end_date": "Present",
                "type": "Education",
                "published": True,
            }
        ],
        "certifications": [],
    }

    for table, items in defaults.items():

        if table == "profile":
            exists = find_one("profile", key="main") is not None
        else:
            exists = len(all_items(table)) > 0

        if exists:
            print(f"Skipping {table}: existing data found.")
            continue

        for item in items:
            insert(table, {**item, "created_at": now()})

        print(f"Seeded {table}.")


if __name__ == "__main__":
    with app.app_context():
        create_admin()
        seed_portfolio()

    print("Database setup completed.")
