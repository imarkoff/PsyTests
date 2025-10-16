from datetime import datetime, UTC
from typing import TYPE_CHECKING, Any
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.user import User
else:
    User = "User"


class TestHistory(Base):
    __tablename__ = 'tests_history'

    id: Mapped[UUID] = mapped_column(primary_key=True, index=True, default=uuid4, unique=True)
    test_id: Mapped[UUID] = mapped_column(nullable=False)
    patient_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    patient: Mapped[User] = relationship(back_populates="tests_history", foreign_keys=[patient_id])
    passed_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(UTC))
    results: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    verdict: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

