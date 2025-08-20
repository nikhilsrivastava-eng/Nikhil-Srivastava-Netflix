from typing import Optional, Tuple
from sqlalchemy.orm import Session

from server.models.user import User
from server.security import hash_password, verify_password, create_access_token


def signup_user(db: Session, *, email: str, name: str, password: str, profile_picture: Optional[str] = None) -> Tuple[User, str]:
    # Validation/business rules
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise ValueError("EMAIL_TAKEN")

    user = User(
        email=email,        
        name=name,
        password_hash=hash_password(password),
        profile_picture=profile_picture,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=str(user.id))
    return user, token


def login_user(db: Session, *, email: str, password: str) -> Tuple[User, str]:
    user: Optional[User] = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise ValueError("INVALID_CREDENTIALS")

    token = create_access_token(subject=str(user.id))
    return user, token
