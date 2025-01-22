from uuid import UUID, uuid4
from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped

from app.db.models.user import User
from app.db.session import Base


class DoctorPatient(Base):
    __tablename__ = "doctor_patients"

    id: Mapped[UUID] = mapped_column(primary_key=True, index=True, default=uuid4())
    doctor_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    doctor: Mapped["User"] = relationship(back_populates="doctor_patient_doctor", foreign_keys=[doctor_id])
    patient_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    patient: Mapped["User"] = relationship(back_populates="doctor_patient_patient", foreign_keys=[patient_id])
    assigned_at: Mapped[datetime] = mapped_column(default=datetime.now)