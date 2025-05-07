from typing import cast

from pydantic import UUID4
from sqlalchemy import or_

from app.db.models.user import User
from app.repositories.base_respository import BaseRepository
from app.schemas.role import Role


class UserRepository(BaseRepository):
    async def get_user_by_id(self, user_id: UUID4) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()

    async def get_user_by_phone(self, phone: str) -> User | None:
        return self.db.query(User).filter(User.phone == phone).first()

    async def get_patients_by_data(self, data: str) -> list[User]:
        result = self.db.query(User).filter(
            User.role == Role.PATIENT,
            or_(
                User.name.ilike(f"%{data}%"),
                User.surname.ilike(f"%{data}%"),
                User.phone.ilike(f"%{data}%")
            )
        ).all()
        return cast(list[User], result)

    async def create_user(self, user: User) -> None:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
