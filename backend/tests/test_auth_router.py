from typing import Any

from fastapi.testclient import TestClient


def test_login_normalizes_email_and_returns_session(client: TestClient, monkeypatch: Any) -> None:
    async def fake_sign_in(email: str, password: str) -> dict[str, str]:
        assert email == "user@example.com"
        assert password == "secret12"
        return {
            "access_token": "id-token",
            "email": email,
            "uid": "uid-1",
            "role": "homeowner",
        }

    monkeypatch.setattr(
        "app.routers.auth.firebase_auth.sign_in_with_password",
        fake_sign_in,
    )
    response = client.post(
        "/auth/login",
        json={"email": "  User@Example.com ", "password": "secret12"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["access_token"] == "id-token"
    assert body["token_type"] == "bearer"
    assert body["email"] == "user@example.com"
    assert body["role"] == "homeowner"


def test_signup_passes_profile(client: TestClient, monkeypatch: Any) -> None:
    async def fake_sign_up(
        email: str,
        password: str,
        *,
        role: str,
        display_name: str | None = None,
        profile: dict[str, Any] | None = None,
    ) -> dict[str, str]:
        assert email == "pro@example.com"
        assert role == "professional"
        assert display_name == "Pat Pro"
        assert profile == {"trade": "plumber"}
        return {
            "access_token": "id-token",
            "email": email,
            "uid": "uid-2",
            "role": role,
            "status": "pending_approval",
        }

    monkeypatch.setattr(
        "app.routers.auth.firebase_auth.sign_up_with_password",
        fake_sign_up,
    )
    response = client.post(
        "/auth/signup",
        json={
            "email": "pro@example.com",
            "password": "secret12",
            "role": "professional",
            "display_name": "  Pat Pro  ",
            "profile": {"trade": "plumber"},
        },
    )
    assert response.status_code == 200
    assert response.json()["status"] == "pending_approval"


def test_session_rejects_invalid_token(client: TestClient, monkeypatch: Any) -> None:
    def boom(_token: str) -> dict[str, str]:
        raise ValueError("bad token")

    monkeypatch.setattr(
        "app.routers.auth.firebase_auth.session_from_id_token",
        boom,
    )
    response = client.post("/auth/session", json={"id_token": "x" * 20})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired Firebase token"


def test_google_login_route(client: TestClient, monkeypatch: Any) -> None:
    monkeypatch.setattr(
        "app.routers.auth.firebase_auth.sign_in_with_google",
        lambda _token: {
            "access_token": "google-token",
            "email": "google@example.com",
            "uid": "uid-g",
            "role": "agent",
            "status": "pending_approval",
        },
    )
    response = client.post("/auth/google/login", json={"id_token": "g" * 20})
    assert response.status_code == 200
    assert response.json()["role"] == "agent"


def test_google_signup_route(client: TestClient, monkeypatch: Any) -> None:
    captured: dict[str, Any] = {}

    def fake_signup(
        id_token: str,
        *,
        role: str,
        display_name: str | None = None,
        profile: dict[str, Any] | None = None,
    ) -> dict[str, str]:
        captured["id_token"] = id_token
        captured["role"] = role
        captured["display_name"] = display_name
        captured["profile"] = profile
        return {
            "access_token": id_token,
            "email": "google@example.com",
            "uid": "uid-g",
            "role": role,
            "status": "pending_approval",
        }

    monkeypatch.setattr(
        "app.routers.auth.firebase_auth.sign_up_with_google",
        fake_signup,
    )
    response = client.post(
        "/auth/google/signup",
        json={
            "id_token": "g" * 20,
            "role": "homeowner",
            "display_name": "  Pat  ",
            "profile": {"phone": "555-0100"},
        },
    )
    assert response.status_code == 200
    assert captured["display_name"] == "Pat"
    assert captured["role"] == "homeowner"


def test_auth_config_route(client: TestClient, monkeypatch: Any) -> None:
    monkeypatch.setattr(
        "app.routers.auth.firebase_auth.firebase_web_config",
        lambda: {
            "apiKey": "web-key",
            "authDomain": "aiqmx-realtor.firebaseapp.com",
            "projectId": "aiqmx-realtor",
        },
    )
    response = client.get("/auth/config")
    assert response.status_code == 200
    assert response.json()["apiKey"] == "web-key"
