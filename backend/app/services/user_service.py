from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user_auth import UserCreate
from app.core.password import cache_password


class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def register_user(self, user_create: UserCreate) -> User:
        (password, password_salt) = cache_password(user_create.password)

        new_user = User(
            name=user_create.name,
            surname=user_create.surname,
            patronymic=user_create.patronymic,
            gender=user_create.gender,
            birth_date=user_create.birth_date,
            phone=user_create.phone,
            password=password,
            password_salt=password_salt,
            role=user_create.role
        )

        self.user_repository.create_user(new_user)

        return new_user

    def get_user_by_id(self, user_id: UUID) -> User | None:
        return self.user_repository.get_user_by_id(user_id)

    def get_user_by_phone(self, phone: str) -> User | None:
        return self.user_repository.get_user_by_phone(phone)

    def get_users_by_data(self, data: str) -> list[User]:
        return self.user_repository.get_users_by_data(data)


def register_user(user_create: UserCreate, db: Session) -> User:
    (password, password_salt) = cache_password(user_create.password)

    new_user = User(
        name=user_create.name,
        surname=user_create.surname,
        patronymic=user_create.patronymic,
        gender=user_create.gender,
        birth_date=user_create.birth_date,
        phone=user_create.phone,
        password=password,
        password_salt=password_salt,
        role=user_create.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def user_by_id(user_id: UUID, db: Session) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_phone(phone: str, db: Session) -> User | None:
    return db.query(User).filter(User.phone == phone).first()