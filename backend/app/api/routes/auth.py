from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette.responses import Response

from app.db.models.user import User
from app.db.session import get_db
from app.schemas.user_auth import UserCreate, UserLogin
from app.utils.password import cache_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", description="Register a new user", responses={
    409: {"description": "User already exists"}
})
async def register_user(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        return Response(status_code=409)

    (password, password_salt) = cache_password(data.password)

    new_user = User(
        name=data.name,
        surname=data.surname,
        email=data.email,
        password=password,
        password_salt=password_salt,
        role=data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return Response(status_code=201)

@router.post("/login", description="Login a user", responses={
    404: {"description": "User not found or password is incorrect"}
})
async def login_user(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password, user.password_salt):
        return Response(status_code=404)

    return user