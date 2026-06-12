import json
import os
import tempfile

from fastapi import APIRouter, HTTPException
from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    GarminConnectConnectionError,
    GarminConnectTooManyRequestsError,
)
from pydantic import BaseModel, EmailStr

from backend.supabase_client import supabase

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
    """
    if not body.email or not body.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    try:
        garmin = Garmin(body.email, body.password)
        # Use temporary directory so no permanent files remain
        with tempfile.TemporaryDirectory() as td:
            tmp_path = os.path.join(td, "garmin_tokens.json")
            garmin.login(tmp_path)  # library writes tokens to tmp_path
            # ensure file is written before reading
            garmin_tokens = {}
            if os.path.exists(tmp_path) and os.path.getsize(tmp_path) > 0:
                with open(tmp_path, "r", encoding="utf-8") as f:
                    garmin_tokens = json.load(f)
            else:
                raise RuntimeError("login did not produce token file")
            
        # Sync user to Supabase auth.users
        user_id = None
        try:
            # Attempt login first
            auth_res = supabase.auth.sign_in_with_password({
                "email": body.email,
                "password": body.password
            })
            if auth_res.user:
                user_id = auth_res.user.id
        except Exception:
            # If login fails, try to sign up
            try:
                auth_res = supabase.auth.sign_up({
                    "email": body.email,
                    "password": body.password
                })
                if auth_res.user:
                    user_id = auth_res.user.id
            except Exception as e:
                print(f"Supabase user creation failed: {e}")

        # Save tokens to user_tokens table
        if user_id and garmin_tokens:
            token_data = {
                "user_id": user_id,
                **garmin_tokens
            }
            try:
                supabase.table("user_tokens").upsert(token_data).execute()
            except Exception as e:
                print(f"Failed to save tokens to user_tokens: {e}")

    except GarminConnectAuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    except (GarminConnectConnectionError, GarminConnectTooManyRequestsError):
        raise HTTPException(status_code=500, detail="Server error.")
    return LoginResponse(
        message="Login successful",
        user={
            "email": body.email,
        },
    )
