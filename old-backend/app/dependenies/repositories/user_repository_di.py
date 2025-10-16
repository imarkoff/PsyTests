from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_postgresql_db
from app.repositories.user_repository import UserRepository


def get_user_repository(db: Session = Depends(get_postgresql_db)) -> UserRepository:
    return UserRepository(db)