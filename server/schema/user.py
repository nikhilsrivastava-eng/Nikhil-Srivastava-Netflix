from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr = Field(..., description="Unique user email")
    name: str = Field(..., min_length=1, max_length=255)
    profile_picture: Optional[str] = Field(None, description="URL to profile picture")
    role: Optional[str] = Field("user", description="user | admin")


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str = Field(..., min_length=6)
    profile_picture: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    profile_picture: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6)


class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str
    profile_picture: Optional[str] = None
    role: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }
