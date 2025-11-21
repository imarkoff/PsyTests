from datetime import datetime
from typing import Optional, Type, cast

from pydantic import BaseModel, ConfigDict

from app.db.models.user import User
from app.schemas.enums.user_gender import UserGender


class UserDto(BaseModel):
    """DTO for transferring user data."""

    name: str
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    gender: UserGender
    birth_date: datetime

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "name": "John",
                "surname": "Doe",
                "patronymic": "Smith",
                "gender": UserGender.MALE,
                "birth_date": "2000-01-01"
            }
        }
    )

    @classmethod
    def create(cls, user: User | Type[User]) -> 'UserDto':
        """
        Create a UserDto instance from a User model instance.
        :param user: User model instance or User class.
        :return: UserDto instance.
        """

        if isinstance(user, type):
            user = cast(User, user)

        return cls(
            name=user.name,
            surname=user.surname,
            patronymic=user.patronymic,
            gender=UserGender(user.gender),
            birth_date=user.birth_date,
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
            case 2 | 3 | 4:
                age_ending = "роки"
            case _:
                age_ending = "років"

        return age, age_ending
