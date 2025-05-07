from uuid import UUID
from warnings import deprecated

from sqlalchemy.orm import Session

from app.db.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user_auth import UserCreate
from app.core.password import cache_password


class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def register_user(self, user_create: UserCreate) -> User:
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

        await self.user_repository.create_user(new_user)

        return new_user

    async def get_user_by_id(self, user_id: UUID) -> User | None:
        return await self.user_repository.get_user_by_id(user_id)

    async def get_user_by_phone(self, phone: str) -> User | None:
        return await self.user_repository.get_user_by_phone(phone)

    async def get_patients_by_data(self, data: str) -> list[User]:
        return await self.user_repository.get_patients_by_data(data)


@deprecated("Use UserService instead")
def user_by_id(user_id: UUID, db: Session) -> User | None:
    return db.query(User).filter(User.id == user_id).first()
