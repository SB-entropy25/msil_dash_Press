import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, List

import jwt
import pandas as pd
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from services.plant_config import CREDENTIALS_FILE, get_plant, PLANTS

JWT_SECRET = os.environ.get("JWT_SECRET_KEY", "MSIL_DASHBOARD_2026_8gK29xLmP4qRt7YzN3vWxA5Bc7Kd9")
JWT_ALGORITHM = "HS256"
DASHBOARD_TOKEN_HOURS = 8
APPEND_TOKEN_MINUTES = 15

_bearer = HTTPBearer(auto_error=False)
_credentials_cache: dict = {"mtime": None, "passwords": {}}


def _load_credentials() -> dict:
    """Load plant_id -> password from plant_credentials.xlsx."""
    if not os.path.exists(CREDENTIALS_FILE):
        return {}

    mtime = os.path.getmtime(CREDENTIALS_FILE)
    if _credentials_cache["mtime"] == mtime and _credentials_cache["passwords"]:
        return _credentials_cache["passwords"]

    df = pd.read_excel(CREDENTIALS_FILE, engine="openpyxl")
    df.columns = df.columns.astype(str).str.strip()

    id_col = next((c for c in df.columns if "plant" in c.lower() and "id" in c.lower()), "Plant ID")
    pass_col = next((c for c in df.columns if "password" in c.lower()), "Password")

    passwords = {}
    for _, row in df.iterrows():
        pid = str(row.get(id_col, "")).strip().lower()
        pwd = str(row.get(pass_col, "")).strip()
        if pid and pwd and pid in PLANTS:
            passwords[pid] = pwd

    _credentials_cache["mtime"] = mtime
    _credentials_cache["passwords"] = passwords
    return passwords


def verify_password(plant_id: str, password: str) -> bool:
    stored = _load_credentials().get(plant_id)
    if not stored:
        return False
    return secrets.compare_digest(stored, password)


def create_token(plant_id: str, permissions: List[str], hours: float = DASHBOARD_TOKEN_HOURS) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "plant": plant_id,
        "permissions": permissions,
        "iat": now,
        "exp": now + timedelta(hours=hours),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_append_token(plant_id: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "plant": plant_id,
        "permissions": ["read", "write"],
        "iat": now,
        "exp": now + timedelta(minutes=APPEND_TOKEN_MINUTES),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token.")


def login(plant_id: str, password: str) -> dict:
    if plant_id not in PLANTS:
        raise HTTPException(status_code=400, detail="Unknown plant.")
    if not verify_password(plant_id, password):
        raise HTTPException(status_code=401, detail="Incorrect password.")

    plant = get_plant(plant_id)
    token = create_token(plant_id, ["read"])
    return {
        "token": token,
        "plant": plant_id,
        "display_name": plant["display_name"],
        "master_file": plant["master_file"],
        "expires_in_hours": DASHBOARD_TOKEN_HOURS,
    }


def verify_append_access(plant_id: str, password: str) -> dict:
    if not verify_password(plant_id, password):
        raise HTTPException(status_code=401, detail="Incorrect password.")
    token = create_append_token(plant_id)
    return {
        "token": token,
        "expires_in_minutes": APPEND_TOKEN_MINUTES,
    }


def _require_auth(
    credentials: Optional[HTTPAuthorizationCredentials],
    required_permission: str,
) -> dict:
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Authentication required.")

    payload = decode_token(credentials.credentials)
    plant_id = payload.get("plant")
    if plant_id not in PLANTS:
        raise HTTPException(status_code=401, detail="Invalid plant in token.")

    permissions = payload.get("permissions", [])
    if required_permission not in permissions:
        raise HTTPException(
            status_code=403,
            detail="Append authorization required. Re-enter your plant password.",
        )

    return {"plant_id": plant_id, "payload": payload, "token": credentials.credentials}


def require_read(credentials: HTTPAuthorizationCredentials = Depends(_bearer)) -> dict:
    return _require_auth(credentials, "read")


def require_write(credentials: HTTPAuthorizationCredentials = Depends(_bearer)) -> dict:
    return _require_auth(credentials, "write")
