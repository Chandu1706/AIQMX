from fastapi import APIRouter, HTTPException, status

from app.config import settings
from app.schemas.auth import LoginRequest, LoginResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest) -> LoginResponse:
    email = body.email.strip().lower()
    if email != settings.demo_email.lower() or body.password != settings.demo_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return LoginResponse(
        access_token="demo-token",
        email=settings.demo_email,
    )
