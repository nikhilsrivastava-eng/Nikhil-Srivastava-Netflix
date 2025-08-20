from datetime import datetime
from pydantic import BaseModel, EmailStr
from server.schema.user import UserOut


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
    issued_at: datetime
    message: str | None = None
