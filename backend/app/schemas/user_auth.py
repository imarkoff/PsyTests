from datetime import datetime
from typing import Optional, Type, cast
from uuid import UUID

from pydantic import BaseModel

from app.db.models.user import User
from app.schemas.role import Role
from app.schemas.user_gender import UserGender


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
                registered_by_id: UUID = None
                ) -> User:
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
    gender: UserGender
    birth_date: datetime
    phone: str
    role: Role
    registered_at: datetime
    registered_by: Optional[UUID] = None

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "id": "8b3dbc3b-58fb-4023-aff9-b332ec8aa701",
                "name": "John",
                "surname": "Doe",
                "patronymic": "Smith",
                "gender": UserGender.MALE,
                "phone": "380999999999",
                "role": Role.PATIENT,
                "registered_at": "2025-01-22T19:05:29.123456",
                "registered_by": "f3847ce2-553a-422b-a2ac-57910619cb6d"
            }
        }

    @classmethod
    def create(cls, user: User | Type[User]) -> 'UserDto':
        if isinstance(user, type):
            user = cast(User, user)

        gender_value = UserGender(user.gender) if isinstance(user.gender, str) else user.gender

        return cls(
            id=user.id,
            name=user.name,
            surname=user.surname,
            patronymic=user.patronymic,
            gender=gender_value,
            birth_date=user.birth_date,
            phone=user.phone,
            role=user.role,
            registered_at=user.registered_at,
            registered_by=user.registered_by_id
        )


    def get_age(self) -> tuple[int, str]:
        """
        Calculate user age based on birthdate

        Returns:
            tuple[int, str]: age and age ending
        """

        today = datetime.now()
        years = today.year - self.birth_date.year
        months = (today.month - self.birth_date.month) // 12

        age = years + months

        age_ending: str
        match age % 10:
            case 1:
                age_ending = "рік"
            case 2, 3, 4:
                age_ending = "роки"
            case _:
                age_ending = "років"

        return age, age_ending