from pydantic.v1 import UUID4
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.schemas.user_auth import UserCreate
from app.core.password import cache_password


def register_user(user_dto: UserCreate, db: Session):
    (password, password_salt) = cache_password(user_dto.password)

    new_user = User(
        name=user_dto.name,
        surname=user_dto.surname,
        email=user_dto.email,
        password=password,
        password_salt=password_salt,
        role=user_dto.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

def user_by_id(user_id: UUID4, db: Session):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(email: str, db: Session):
    return db.query(User).filter(User.email == email).first()