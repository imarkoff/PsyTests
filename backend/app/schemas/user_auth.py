from datetime import datetime
from typing import Optional, Type, cast
from uuid import UUID

from pydantic import BaseModel

from app.db.models.user import User
from app.schemas.role import Role


class UserCreate(BaseModel):
    name: str
    surname: Optional[str] = None
    patronymic: Optional[str] = None
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
                "phone": "380999999999",
                "password": "password1234",
                "role": "patient"
            }
        }


class UserLogin(BaseModel):
    phone: str
    password: str

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "phone": "380999999999",
                "password": "password1234"
            }
        }

class UserDto(BaseModel):
    id: UUID
    name: str
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    birth_date: datetime
    phone: str
    role: Role

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "id": "8b3dbc3b-58fb-4023-aff9-b332ec8aa701",
                "name": "John",
                "surname": "Doe",
                "phone": "380999999999",
                "role": "patient"
            }
        }

    @classmethod
    def create(cls, user: User | Type[User]):
        if isinstance(user, type):
            user = cast(User, user)

        return cls(
            id=user.id,
            name=user.name,
            surname=user.surname,
            patronymic=user.patronymic,
            birth_date=user.birth_date,
            phone=user.phone,
            role=user.role
        )
