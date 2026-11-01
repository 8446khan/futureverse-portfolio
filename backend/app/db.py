import json
import os
import sqlite3

from datetime import datetime, timezone
from flask import current_app, g

TABLES = {
    "users",
    "profile",
    "projects",
    "skills",
    "experience",
    "certifications",
    "messages",
    "page_views",
}


def validate_table(table):
    if table not in TABLES:
        raise ValueError("Unknown table")


def get_db():
    if "db" not in g:
        path = current_app.config["DATABASE"]

        directory = os.path.dirname(path)

        if directory:
            os.makedirs(directory, exist_ok=True)

        connection = sqlite3.connect(path, timeout=10)

        connection.row_factory = sqlite3.Row

        connection.execute("PRAGMA foreign_keys = ON")
        connection.execute("PRAGMA journal_mode = WAL")
        connection.execute("PRAGMA busy_timeout = 10000")

        g.db = connection

    return g.db


def close_db(_error=None):
    connection = g.pop("db", None)

    if connection is not None:
        connection.close()


def init_db():
    db = get_db()

    for table in TABLES:
        db.execute(f"""
            CREATE TABLE IF NOT EXISTS {table} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                data TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)

    db.execute("""
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email
        ON users(json_extract(data, '$.email'))
    """)

    db.execute("""
        CREATE UNIQUE INDEX IF NOT EXISTS idx_profile_key
        ON profile(json_extract(data, '$.key'))
    """)

    db.commit()


def _decode(row):
    if row is None:
        return None

    item = json.loads(row["data"])

    item["id"] = str(row["id"])

    item.setdefault("created_at", row["created_at"])

    return item


def all_items(table, order_by="created_at", descending=True):
    validate_table(table)

    rows = get_db().execute(f"SELECT id, data, created_at FROM {table}").fetchall()

    items = [_decode(row) for row in rows]

    return sorted(
        items, key=lambda item: str(item.get(order_by, "")), reverse=descending
    )


def find_one(table, **criteria):
    validate_table(table)

    return next(
        (
            item
            for item in all_items(table)
            if all(item.get(key) == value for key, value in criteria.items())
        ),
        None,
    )


def insert(table, item):
    validate_table(table)

    payload = dict(item)

    created = payload.setdefault("created_at", datetime.now(timezone.utc).isoformat())

    db = get_db()

    cursor = db.execute(
        f"""
        INSERT INTO {table} (data, created_at)
        VALUES (?, ?)
        """,
        (json.dumps(payload, ensure_ascii=False), str(created)),
    )

    db.commit()

    return get(table, cursor.lastrowid)


def get(table, item_id):
    validate_table(table)

    try:
        item_id = int(item_id)
    except (TypeError, ValueError):
        return None

    row = (
        get_db()
        .execute(
            f"""
        SELECT id, data, created_at
        FROM {table}
        WHERE id = ?
        """,
            (item_id,),
        )
        .fetchone()
    )

    return _decode(row)


def update(table, item_id, changes):
    validate_table(table)

    existing = get(table, item_id)

    if not existing:
        return None

    existing.pop("id", None)

    existing.update(changes)

    db = get_db()

    db.execute(
        f"""
        UPDATE {table}
        SET data = ?
        WHERE id = ?
        """,
        (json.dumps(existing, ensure_ascii=False), int(item_id)),
    )

    db.commit()

    return get(table, item_id)


def delete(table, item_id):
    validate_table(table)

    try:
        item_id = int(item_id)
    except (TypeError, ValueError):
        return False

    cursor = get_db().execute(f"DELETE FROM {table} WHERE id = ?", (item_id,))

    get_db().commit()

    return cursor.rowcount > 0


def count(table, **criteria):
    validate_table(table)

    return sum(
        1
        for item in all_items(table)
        if all(item.get(key) == value for key, value in criteria.items())
    )


def upsert_by(table, key, value, payload):
    validate_table(table)

    existing = find_one(table, **{key: value})

    if existing:
        return update(table, existing["id"], payload)

    return insert(table, payload)
