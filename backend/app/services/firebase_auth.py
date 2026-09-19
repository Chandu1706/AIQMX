from __future__ import annotations

from typing import Any

import httpx
from fastapi import HTTPException, status

from app.config import settings
from app.firebase_app import set_user_claims, verify_id_token
from app.services import firestore_users

IDENTITY_TOOLKIT = "https://identitytoolkit.googleapis.com/v1"


def _require_web_api_key() -> str:
    key = settings.firebase_web_api_key.strip()
    if not key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "FIREBASE_WEB_API_KEY is not set. Copy the Web API Key from "
                "Firebase Console → Project settings → General into backend/.env"
            ),
        )
    return key


def _map_firebase_error(payload: dict[str, Any], fallback: str) -> str:
    err = payload.get("error") or {}
    message = str(err.get("message") or fallback)
    mapping = {
        "EMAIL_EXISTS": "An account with this email already exists",
        "EMAIL_NOT_FOUND": "Invalid email or password",
        "INVALID_PASSWORD": "Invalid email or password",
        "INVALID_LOGIN_CREDENTIALS": "Invalid email or password",
        "USER_DISABLED": "This account has been disabled",
        "TOO_MANY_ATTEMPTS_TRY_LATER": "Too many attempts. Try again later",
        "WEAK_PASSWORD": "Password should be at least 6 characters",
        "INVALID_EMAIL": "Enter a valid email address",
        "OPERATION_NOT_ALLOWED": "Email/password sign-in is disabled in Firebase",
    }
    for code, text in mapping.items():
        if code in message:
            return text
    return fallback


async def _identity_toolkit(path: str, body: dict[str, Any]) -> dict[str, Any]:
    key = _require_web_api_key()
    url = f"{IDENTITY_TOOLKIT}/{path}?key={key}"
    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(url, json=body)
    payload = response.json() if response.content else {}
    if response.is_error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
            if response.status_code in {400, 401, 403}
            else status.HTTP_502_BAD_GATEWAY,
            detail=_map_firebase_error(payload, "Authentication failed"),
        )
    return payload


async def sign_in_with_password(email: str, password: str) -> dict[str, Any]:
    payload = await _identity_toolkit(
        "accounts:signInWithPassword",
        {
            "email": email,
            "password": password,
            "returnSecureToken": True,
        },
    )
    id_token = payload.get("idToken")
    if not isinstance(id_token, str) or not id_token:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Firebase did not return an ID token",
        )
    decoded = verify_id_token(id_token)
    return {
        "access_token": id_token,
        "refresh_token": payload.get("refreshToken"),
        "expires_in": payload.get("expiresIn"),
        "email": payload.get("email") or decoded.get("email"),
        "uid": decoded.get("uid") or payload.get("localId"),
        "role": (decoded.get("role") if isinstance(decoded.get("role"), str) else None),
    }


async def sign_up_with_password(
    email: str,
    password: str,
    *,
    role: str,
    display_name: str | None = None,
    profile: dict[str, Any] | None = None,
) -> dict[str, Any]:
    payload = await _identity_toolkit(
        "accounts:signUp",
        {
            "email": email,
            "password": password,
            "returnSecureToken": True,
        },
    )
    id_token = payload.get("idToken")
    uid = payload.get("localId")
    if not isinstance(id_token, str) or not id_token or not isinstance(uid, str):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Firebase did not return signup credentials",
        )

    # Keep Auth claims small; full registration data goes to Firestore.
    claims: dict[str, Any] = {"role": role, "status": "pending_approval"}

    try:
        set_user_claims(uid, claims)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Account created but failed to set role claims: {exc}",
        ) from exc

    try:
        firestore_users.upsert_user_profile(
            uid=uid,
            email=email,
            role=role,
            status="pending_approval",
            display_name=display_name,
            profile=profile,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Account created but failed to save profile in Firestore: {exc}",
        ) from exc

    # Re-sign-in so the returned ID token includes custom claims
    session = await sign_in_with_password(email, password)
    session["role"] = role
    session["status"] = "pending_approval"
    return session


def session_from_id_token(id_token: str) -> dict[str, Any]:
    decoded = verify_id_token(id_token)
    return {
        "access_token": id_token,
        "email": decoded.get("email"),
        "uid": decoded.get("uid"),
        "role": decoded.get("role") if isinstance(decoded.get("role"), str) else None,
        "status": decoded.get("status") if isinstance(decoded.get("status"), str) else None,
    }


GOOGLE_PROVIDER = "google.com"


def firebase_web_config() -> dict[str, str]:
    return {
        "apiKey": _require_web_api_key(),
        "authDomain": settings.firebase_auth_domain.strip()
        or f"{settings.firebase_project_id}.firebaseapp.com",
        "projectId": settings.firebase_project_id,
    }


def _sign_in_provider(decoded: dict[str, Any]) -> str | None:
    firebase = decoded.get("firebase")
    if not isinstance(firebase, dict):
        return None
    provider = firebase.get("sign_in_provider")
    return provider if isinstance(provider, str) else None


def decode_google_id_token(id_token: str) -> dict[str, Any]:
    try:
        decoded = verify_id_token(id_token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase token",
        ) from exc
    if _sign_in_provider(decoded) != GOOGLE_PROVIDER:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google sign-in required",
        )
    uid = decoded.get("uid")
    if not isinstance(uid, str) or not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google sign-in required",
        )
    return decoded


def sign_in_with_google(id_token: str) -> dict[str, Any]:
    decoded = decode_google_id_token(id_token)
    uid = str(decoded["uid"])
    doc = firestore_users.get_user_profile(uid)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No AIQMX account for this Google user. Sign up first.",
        )
    return {
        "access_token": id_token,
        "email": decoded.get("email") or doc.get("email"),
        "uid": uid,
        "role": doc.get("role") if isinstance(doc.get("role"), str) else None,
        "status": doc.get("status") if isinstance(doc.get("status"), str) else None,
    }


def sign_up_with_google(
    id_token: str,
    *,
    role: str,
    display_name: str | None = None,
    profile: dict[str, Any] | None = None,
) -> dict[str, Any]:
    decoded = decode_google_id_token(id_token)
    uid = str(decoded["uid"])
    email = decoded.get("email")
    if not isinstance(email, str) or not email.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account did not provide an email address",
        )
    email = email.strip().lower()

    existing = firestore_users.get_user_profile(uid)
    if existing:
        return sign_in_with_google(id_token)

    name = display_name.strip() if display_name else None
    if not name:
        raw_name = decoded.get("name")
        name = raw_name.strip() if isinstance(raw_name, str) and raw_name.strip() else None

    claims: dict[str, Any] = {"role": role, "status": "pending_approval"}
    try:
        set_user_claims(uid, claims)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Google account signed in but failed to set role claims: {exc}",
        ) from exc

    try:
        firestore_users.upsert_user_profile(
            uid=uid,
            email=email,
            role=role,
            status="pending_approval",
            display_name=name,
            profile=profile,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Google account signed in but failed to save profile in Firestore: {exc}",
        ) from exc

    return {
        "access_token": id_token,
        "email": email,
        "uid": uid,
        "role": role,
        "status": "pending_approval",
    }
