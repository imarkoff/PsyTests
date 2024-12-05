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


class UserLogin(BaseModel):
    email: str
    password: str

    class Config:
        from_attributes = True