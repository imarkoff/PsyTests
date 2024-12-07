import uuid

from sqlalchemy import Column, String, Enum, LargeBinary, UUID
from app.db.postgresql.session import Base
from app.schemas.role import Role


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4())
    name = Column(String, index=True, nullable=False)
    surname = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(LargeBinary, nullable=False)
    password_salt = Column(LargeBinary, nullable=False)
    role = Column(Enum(Role), default=Role.PATIENT, nullable=False)