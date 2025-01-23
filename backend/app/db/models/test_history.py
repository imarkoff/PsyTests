from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.db.models.user import User
else:
    User = "User"

from app.db.session import Base


class TestHistory(Base):
    __tablename__ = 'tests_history'

    id: Mapped[UUID] = mapped_column(primary_key=True, index=True, default=uuid4, unique=True)
    test_id: Mapped[UUID] = mapped_column(nullable=False)
    patient_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    patient: Mapped[User] = relationship(back_populates="tests_history", foreign_keys=[patient_id])
    total_points: Mapped[int] = mapped_column(nullable=False)
    correct_points: Mapped[int] = mapped_column(nullable=False)
    passed_at: Mapped[datetime] = mapped_column(default=datetime.now)