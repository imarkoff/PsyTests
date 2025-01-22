from uuid import UUID, uuid4
from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.db.models.user import User
from app.db.session import Base


class PatientTest(Base):
    __tablename__ = "patient_tests"

    id: Mapped[UUID] = mapped_column(primary_key=True, index=True, default=uuid4())
    test_id: Mapped[UUID] = mapped_column(index=True)
    patient_id:Mapped[UUID] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    patient: Mapped["User"] = relationship(foreign_keys=[patient_id])
    assigned_by_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    assigned_by: Mapped["User"] = relationship(foreign_keys=[assigned_by_id])
    assigned_at: Mapped[datetime] = mapped_column(default=datetime.now)