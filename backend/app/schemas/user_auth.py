from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.schemas.role import Role


class UserCreate(BaseModel):
    name: str
    surname: Optional[str] = None
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