from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import jwt
import os
from datetime import datetime, timedelta
from typing import Dict, Any

router = APIRouter(prefix="/api/auth", tags=["auth"])

SECRET = os.getenv("BETTER_AUTH_SECRET", "your-secret-key")

# In-memory user storage
users_db = {}

class SignUpRequest(BaseModel):
    email: str
    password: str

class SignInRequest(BaseModel):
    email: str
    password: str

def create_jwt_token(user_id: str, expires_delta: timedelta = None) -> str:
    """Create a JWT token"""
    if expires_delta is None:
        expires_delta = timedelta(days=7)
    
    expire = datetime.utcnow() + expires_delta
    payload = {
        "sub": user_id,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET, algorithm="HS256")
    return token


@router.post("/sign-up")
def sign_up(data: SignUpRequest) -> Dict[str, Any]:
    """Sign up a new user"""
    email = data.email
    password = data.password
    if email in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Store user (in production, hash password!)
    users_db[email] = {"password": password, "id": email}
    token = create_jwt_token(email)
    
    return {
        "user": {"email": email, "id": email},
        "token": token,
        "session": {"token": token, "user": {"email": email, "id": email}}
    }


@router.post("/sign-in")
def sign_in(data: SignInRequest) -> Dict[str, Any]:
    """Sign in an existing user"""
    email = data.email
    password = data.password
    if email not in users_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user = users_db[email]
    if user["password"] != password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    token = create_jwt_token(email)
    
    return {
        "user": {"email": email, "id": email},
        "token": token,
        "session": {"token": token, "user": {"email": email, "id": email}}
    }


@router.post("/sign-out")
def sign_out():
    """Sign out user"""
    return {"message": "Signed out successfully"}


@router.get("/session")
def get_session(authorization: str = None) -> Dict[str, Any]:
    """Get current session"""
    if not authorization:
        return {"session": None}
    
    try:
        scheme, token = authorization.split(" ", 1)
        if scheme.lower() != "bearer":
            return {"session": None}
        
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
        
        return {
            "session": {
                "token": token,
                "user": {"email": user_id, "id": user_id}
            }
        }
    except:
        return {"session": None}
