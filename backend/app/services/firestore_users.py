from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from google.cloud.firestore_v1 import SERVER_TIMESTAMP

from app.firebase_app import get_firestore_client

USERS_COLLECTION = "users"


def upsert_user_profile(
    *,
    uid: str,
    email: str,
    role: str,
    status: str = "pending_approval",
    display_name: str | None = None,
    profile: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Store registration/reference data in Firestore under users/{uid}."""
    db = get_firestore_client()
    clean_profile = {
        key: value
        for key, value in (profile or {}).items()
        if value is not None and str(value).strip() != ""
    }
    now = datetime.now(timezone.utc).isoformat()
    payload: dict[str, Any] = {
        "uid": uid,
        "email": email,
        "role": role,
        "account_type": role,
        "status": status,
        "display_name": display_name,
        "profile": clean_profile,
        "updated_at": SERVER_TIMESTAMP,
    }

    ref = db.collection(USERS_COLLECTION).document(uid)
    existing = ref.get()
    if existing.exists:
        ref.set(payload, merge=True)
    else:
        payload["created_at"] = SERVER_TIMESTAMP
        payload["created_at_iso"] = now
        ref.set(payload)

    saved = ref.get().to_dict() or payload
    # SERVER_TIMESTAMP may still be a sentinel in local dict; normalize for API use
    return {
        "uid": uid,
        "email": email,
        "role": role,
        "status": status,
        "display_name": display_name,
        "profile": clean_profile,
        "created_at": saved.get("created_at_iso") or now,
    }


def get_user_profile(uid: str) -> dict[str, Any] | None:
    db = get_firestore_client()
    snap = db.collection(USERS_COLLECTION).document(uid).get()
    if not snap.exists:
        return None
    data = snap.to_dict() or {}
    return data
