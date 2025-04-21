from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.schemas.user_gender import UserGender


class PatientCreateDto(BaseModel):
    """DTO for creating a new patient user."""
    name: str
    surname: Optional[str]
    patronymic: Optional[str] = None
    gender: UserGender
    birth_date: datetime
    phone: str
    password: str

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "name": "John",
                "surname": "Doe",
                "patronymic": "Smith",
                "gender": "male",
                "birth_date": "1990-01-01T00:00:00Z",
                "phone": "380999999999",
                "password": "password1234"
            }
        }