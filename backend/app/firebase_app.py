from __future__ import annotations

from functools import lru_cache
from pathlib import Path

import firebase_admin
from firebase_admin import auth, credentials, firestore

from app.config import settings


@lru_cache(maxsize=1)
def get_firebase_app() -> firebase_admin.App:
    if firebase_admin._apps:
        return firebase_admin.get_app()

    path = Path(settings.firebase_credentials_path)
    if not path.is_file():
        raise RuntimeError(
            f"Firebase service account not found at {path}. "
            "Place the JSON at backend/secrets/firebase-service-account.json"
        )

    cred = credentials.Certificate(str(path))
    return firebase_admin.initialize_app(
        cred,
        {"projectId": settings.firebase_project_id},
    )


@lru_cache(maxsize=1)
def get_firestore_client():
    get_firebase_app()
    return firestore.client()


def verify_id_token(id_token: str) -> dict:
    get_firebase_app()
    return auth.verify_id_token(id_token)


def set_user_claims(uid: str, claims: dict) -> None:
    get_firebase_app()
    auth.set_custom_user_claims(uid, claims)


def get_user(uid: str):
    get_firebase_app()
    return auth.get_user(uid)
