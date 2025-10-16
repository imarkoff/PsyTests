from abc import ABC

from sqlalchemy.orm import Session


class SQLAlchemyRepository(ABC):
    def __init__(self, db: Session):
        self.db = db