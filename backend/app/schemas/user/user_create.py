from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.db.models.user import User
from app.schemas.enums.role import Role
from app.schemas.enums.user_gender import UserGender


class UserCreate(BaseModel):
    """DTO for creating a new user."""

    name: str
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    gender: UserGender
    birth_date: datetime
    phone: str
    password: str
    role: Optional[Role] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "name": "John",
                "surname": "Doe",
                "patronymic": "Smith",
                "gender": "male",
                "birth_date": "2000-01-01",
                "phone": "380999999999",
                "password": "password1234",
                "role": "patient"
            }
        }

    def to_user(self,
                password: bytes, password_salt: bytes,
                registered_by_id: UUID | None = None
                ) -> User:
        """
         Convert UserCreate schema to User model instance.
         :param password: Hashed password.
         :param password_salt: Salt used for hashing the password.
         :param registered_by_id: ID of the user who registered this user.
         :return: User model instance.
         """
        
        return User(
            name=self.name,
            surname=self.surname,
            patronymic=self.patronymic,
            gender=self.gender,
            birth_date=self.birth_date,
            phone=self.phone,
            password=password,
            password_salt=password_salt,
            role=self.role,
            registered_by_id=registered_by_id
        )
