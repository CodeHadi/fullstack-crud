from fastapi import Depends, HTTPException, Header, status
import jwt
from dotenv import load_dotenv
import os

load_dotenv()

SECRET = os.getenv("BETTER_AUTH_SECRET")

if not SECRET:
    raise ValueError("BETTER_AUTH_SECRET not found in .env")


async def get_current_user(authorization: str = Header(None)) -> str:
    """
    Extract and verify JWT token from Authorization header.
    Returns user_id from token payload, or defaults to 'demo-user' if no token.
    """
    # Default to demo user if no auth provided (for testing)
    if not authorization:
        return "demo-user"
    
    try:
        parts = authorization.split(" ")
        if len(parts) != 2:
            raise ValueError("Invalid format")
        scheme, token = parts
        if scheme.lower() != "bearer":
            return "demo-user"
        
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            return "demo-user"
        
        return user_id
        
    except jwt.ExpiredSignatureError:
        return "demo-user"
    except jwt.InvalidTokenError:
        return "demo-user"
    except Exception:
        return "demo-user"
