from fastapi import Depends

from app.db.session import get_postgresql_db
from app.repositories.test_history_repository import TestHistoryRepository


def get_test_history_repository(db=Depends(get_postgresql_db)):
    return TestHistoryRepository(db)
