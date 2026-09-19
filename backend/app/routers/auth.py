from fastapi import APIRouter, Depends, HTTPException, status

from app.deps import get_current_user
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    MeResponse,
    SessionRequest,
    SignupRequest,
)
from app.services import firebase_auth, firestore_users

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest) -> AuthResponse:
    email = body.email.strip().lower()
    session = await firebase_auth.sign_in_with_password(email, body.password)
    return AuthResponse(**session)


@router.post("/signup", response_model=AuthResponse)
async def signup(body: SignupRequest) -> AuthResponse:
    email = body.email.strip().lower()
    session = await firebase_auth.sign_up_with_password(
        email,
        body.password,
        role=body.role,
        display_name=body.display_name.strip() if body.display_name else None,
        profile=body.profile,
    )
    return AuthResponse(**session)


@router.post("/session", response_model=AuthResponse)
def establish_session(body: SessionRequest) -> AuthResponse:
    try:
        session = firebase_auth.session_from_id_token(body.id_token)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase token",
        ) from exc
    return AuthResponse(**session)


@router.get("/me", response_model=MeResponse)
def me(user: dict = Depends(get_current_user)) -> MeResponse:
    uid = str(user.get("uid") or "")
    doc = firestore_users.get_user_profile(uid) if uid else None
    role = None
    status = None
    display_name = None
    profile: dict = {}
    if doc:
        role = doc.get("role") if isinstance(doc.get("role"), str) else None
        status = doc.get("status") if isinstance(doc.get("status"), str) else None
        display_name = (
            doc.get("display_name") if isinstance(doc.get("display_name"), str) else None
        )
        raw_profile = doc.get("profile")
        profile = raw_profile if isinstance(raw_profile, dict) else {}

    return MeResponse(
        uid=uid,
        email=user.get("email") or (doc or {}).get("email"),
        role=role or (user.get("role") if isinstance(user.get("role"), str) else None),
        status=status
        or (user.get("status") if isinstance(user.get("status"), str) else None),
        display_name=display_name,
        profile=profile,
        claims={
            k: v
            for k, v in user.items()
            if k
            not in {
                "uid",
                "email",
                "aud",
                "iss",
                "sub",
                "iat",
                "exp",
                "auth_time",
                "firebase",
            }
        },
    )


@router.post("/logout")
def logout() -> dict[str, str]:
    # Firebase ID tokens are client-held; clearing local storage is enough for now.
    return {"status": "ok"}
