from datetime import datetime, UTC
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from pydantic import ValidationError
from sqlalchemy import ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.schemas.test.test_history_results import Results

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
    passed_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(UTC))
    results: Mapped[dict[str, list[dict[str, int | None]]]] = mapped_column(JSON, nullable=False)
    verdict: Mapped[str | None] = mapped_column(nullable=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.validate_results()

    def validate_results(self):
        try:
            Results.model_validate(self.results)
        except ValidationError as e:
            raise ValueError(f"Invalid results structure: {e}")
