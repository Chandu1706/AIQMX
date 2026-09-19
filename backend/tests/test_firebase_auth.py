import pytest
from fastapi import HTTPException

from app.services import firebase_auth


def test_map_firebase_error_known_codes() -> None:
    payload = {"error": {"message": "EMAIL_EXISTS : extra"}}
    assert (
        firebase_auth._map_firebase_error(payload, "fallback")
        == "An account with this email already exists"
    )
    payload = {"error": {"message": "INVALID_LOGIN_CREDENTIALS"}}
    assert firebase_auth._map_firebase_error(payload, "fallback") == "Invalid email or password"


def test_map_firebase_error_fallback() -> None:
    assert firebase_auth._map_firebase_error({}, "Authentication failed") == "Authentication failed"
    assert (
        firebase_auth._map_firebase_error(
            {"error": {"message": "UNKNOWN"}}, "Authentication failed"
        )
        == "Authentication failed"
    )


def test_require_web_api_key_missing(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(firebase_auth.settings, "firebase_web_api_key", "  ")
    with pytest.raises(HTTPException) as exc:
        firebase_auth._require_web_api_key()
    assert exc.value.status_code == 503


def test_require_web_api_key_present(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(firebase_auth.settings, "firebase_web_api_key", "abc123")
    assert firebase_auth._require_web_api_key() == "abc123"


def test_session_from_id_token(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        firebase_auth,
        "verify_id_token",
        lambda _token: {
            "email": "user@example.com",
            "uid": "uid-1",
            "role": "tenant",
            "status": "pending_approval",
        },
    )
    session = firebase_auth.session_from_id_token("token-value")
    assert session["access_token"] == "token-value"
    assert session["uid"] == "uid-1"
    assert session["role"] == "tenant"
    assert session["status"] == "pending_approval"


def _google_claims(**overrides: object) -> dict:
    claims: dict = {
        "uid": "uid-g",
        "email": "google@example.com",
        "name": "G User",
        "firebase": {"sign_in_provider": "google.com"},
    }
    claims.update(overrides)
    return claims


def test_google_login_requires_existing_profile(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(firebase_auth, "verify_id_token", lambda _token: _google_claims())
    monkeypatch.setattr(firebase_auth.firestore_users, "get_user_profile", lambda _uid: None)
    with pytest.raises(HTTPException) as exc:
        firebase_auth.sign_in_with_google("google-id-token-value")
    assert exc.value.status_code == 409


def test_google_login_returns_profile(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(firebase_auth, "verify_id_token", lambda _token: _google_claims())
    monkeypatch.setattr(
        firebase_auth.firestore_users,
        "get_user_profile",
        lambda _uid: {
            "email": "google@example.com",
            "role": "tenant",
            "status": "pending_approval",
        },
    )
    session = firebase_auth.sign_in_with_google("google-id-token-value")
    assert session["uid"] == "uid-g"
    assert session["role"] == "tenant"
    assert session["status"] == "pending_approval"


def test_google_signup_rejects_non_google_provider(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        firebase_auth,
        "verify_id_token",
        lambda _token: _google_claims(firebase={"sign_in_provider": "password"}),
    )
    with pytest.raises(HTTPException) as exc:
        firebase_auth.sign_up_with_google("token", role="homeowner")
    assert exc.value.status_code == 401
    assert exc.value.detail == "Google sign-in required"


def test_google_signup_creates_profile(monkeypatch: pytest.MonkeyPatch) -> None:
    saved: dict = {}

    monkeypatch.setattr(firebase_auth, "verify_id_token", lambda _token: _google_claims())
    monkeypatch.setattr(firebase_auth.firestore_users, "get_user_profile", lambda _uid: None)

    def fake_claims(uid: str, claims: dict) -> None:
        saved["uid"] = uid
        saved["claims"] = claims

    def fake_upsert(**kwargs: object) -> dict:
        saved["profile"] = kwargs
        return {}

    monkeypatch.setattr(firebase_auth, "set_user_claims", fake_claims)
    monkeypatch.setattr(firebase_auth.firestore_users, "upsert_user_profile", fake_upsert)

    session = firebase_auth.sign_up_with_google(
        "google-id-token-value",
        role="homeowner",
        display_name="  Jane  ",
        profile={"phone": "555-0100"},
    )
    assert session["role"] == "homeowner"
    assert session["email"] == "google@example.com"
    assert saved["claims"] == {"role": "homeowner", "status": "pending_approval"}
    assert saved["profile"]["display_name"] == "Jane"
    assert saved["profile"]["profile"] == {"phone": "555-0100"}


def test_firebase_web_config(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(firebase_auth.settings, "firebase_web_api_key", "web-key")
    monkeypatch.setattr(firebase_auth.settings, "firebase_project_id", "aiqmx-realtor")
    monkeypatch.setattr(firebase_auth.settings, "firebase_auth_domain", "")
    config = firebase_auth.firebase_web_config()
    assert config["apiKey"] == "web-key"
    assert config["authDomain"] == "aiqmx-realtor.firebaseapp.com"
    assert config["projectId"] == "aiqmx-realtor"
