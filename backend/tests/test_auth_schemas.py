import pytest
from pydantic import ValidationError

from app.schemas.auth import LoginRequest, SignupRequest


def test_signup_accepts_known_roles() -> None:
    for role in ("homeowner", "tenant", "professional", "agent"):
        body = SignupRequest(
            email="user@example.com",
            password="secret12",
            role=role,
            display_name="Jane Doe",
        )
        assert body.role == role


def test_signup_rejects_unknown_role() -> None:
    with pytest.raises(ValidationError):
        SignupRequest(
            email="user@example.com",
            password="secret12",
            role="admin",  # type: ignore[arg-type]
        )


def test_signup_requires_password_length() -> None:
    with pytest.raises(ValidationError):
        SignupRequest(
            email="user@example.com",
            password="123",
            role="homeowner",
        )


def test_login_strips_nothing_but_requires_fields() -> None:
    body = LoginRequest(email="a@b.co", password="x")
    assert body.email == "a@b.co"
    with pytest.raises(ValidationError):
        LoginRequest(email="ab", password="x")
