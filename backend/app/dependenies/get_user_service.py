from fastapi import Depends

from app.db.session import get_postgresql_db
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService


def get_user_service(db=Depends(get_postgresql_db)):
    repo = UserRepository(db)
    return UserService(repo)
