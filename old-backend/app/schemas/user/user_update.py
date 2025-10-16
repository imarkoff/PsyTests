from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.db.models.user import User
from app.schemas.enums.user_gender import UserGender


class UserUpdate(BaseModel):
    """DTO for updating an existing user."""

    name: str
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    gender: UserGender
    birth_date: datetime
    phone: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "John",
                "surname": "Doe",
                "patronymic": "Smith",
                "gender": "male",
                "birth_date": "2000-01-01",
                "phone": "380999999999",
            }
        }
    )

    def update_model(self, model: User):
        """
        Update a User model instance with data from the UserUpdate schema.
        :param model: User model instance to be updated.
        """

        model.name = self.name
        model.surname = self.surname
        model.patronymic = self.patronymic
        model.gender = self.gender
        model.birth_date = self.birth_date
        model.phone = self.phone
