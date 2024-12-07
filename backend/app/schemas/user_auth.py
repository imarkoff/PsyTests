from typing import Optional
from pydantic import BaseModel
from app.schemas.role import Role


class UserCreate(BaseModel):
    name: str
    surname: str
    email: str
    password: str
    role: Optional[Role] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "name": "John",
                "surname": "Doe",
                "email": "johndoe@gmail.com",
                "password": "password1234",
                "role": "patient"
            }
        }


class UserLogin(BaseModel):
    email: str
    password: str

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "email": "johndoe@gmail.com",
                "password": "password1234"
            }
        }

class UserDto(BaseModel):
    name: str
    surname: str
    email: str
    role: Role

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "name": "John",
                "surname": "Doe",
                "email": "johndoe@gmail.com",
                "role": "patient"
            }
        }