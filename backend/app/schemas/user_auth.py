from datetime import datetime
from typing import Optional, Type, cast
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.db.models.user import User
from app.schemas.enums.role import Role
from app.schemas.enums.user_gender import UserGender


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
    last_login: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "8b3dbc3b-58fb-4023-aff9-b332ec8aa701",
                "name": "John",
                "surname": "Doe",
                "patronymic": "Smith",
                "gender": UserGender.MALE,
                "phone": "380999999999",
                "role": Role.PATIENT,
                "registered_at": "2025-01-22T19:05:29.123456",
                "registered_by": "f3847ce2-553a-422b-a2ac-57910619cb6d",
                "birth_date": "2000-01-01",
                "last_login": "2025-01-22T19:05:29.123456"
            }
        }
    )

    @classmethod
    def create(cls, user: User | Type[User]) -> 'UserDto':
        if isinstance(user, type):
            user = cast(User, user)

        return cls(
            id=user.id,
            name=user.name,
            surname=user.surname,
            patronymic=user.patronymic,
            gender=UserGender(user.gender),
            birth_date=user.birth_date,
            phone=user.phone,
            role=user.role,
            registered_at=user.registered_at,
            registered_by=user.registered_by_id,
            last_login=user.last_login
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