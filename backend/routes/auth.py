from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    message: str
    user: dict


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest):
    """
    Authenticate with Garmin Connect credentials.

    TODO: Replace this stub with real Garmin session auth.
    """
    if not body.email or not body.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    # --- Stub: accept any credentials for now ---
    return LoginResponse(
        message="Login successful",
        user={
            "email": body.email,
        },
    )
