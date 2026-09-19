from typing import Any, Literal

from pydantic import BaseModel, Field

Role = Literal["homeowner", "professional", "agent", "tenant"]


class LoginRequest(BaseModel):
    email: str = Field(min_length=3)
    password: str = Field(min_length=1)


class SignupRequest(BaseModel):
    email: str = Field(min_length=3)
    password: str = Field(min_length=6)
    role: Role
    display_name: str | None = None
    profile: dict[str, Any] | None = None


class SessionRequest(BaseModel):
    id_token: str = Field(min_length=20)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str | None = None
    uid: str | None = None
    role: str | None = None
    status: str | None = None
    refresh_token: str | None = None
    expires_in: str | None = None


class MeResponse(BaseModel):
    uid: str
    email: str | None = None
    role: str | None = None
    status: str | None = None
    display_name: str | None = None
    profile: dict[str, Any] = Field(default_factory=dict)
    claims: dict[str, Any] = Field(default_factory=dict)
