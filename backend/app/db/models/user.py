from datetime import datetime
from uuid import UUID, uuid4
from typing import List, Optional, TYPE_CHECKING

from app.db.base import Base
from app.db.models.test_history import TestHistory

if TYPE_CHECKING:
    from app.db.models.doctor_patient import DoctorPatient
    from app.db.models.patient_test import PatientTest
else:
    DoctorPatient = "DoctorPatient"
    PatientTest = "PatientTest"

from sqlalchemy import String, Enum
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.schemas.role import Role


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(primary_key=True, index=True, default=uuid4, unique=True)
    name: Mapped[str] = mapped_column(index=True, nullable=False)
    surname: Mapped[Optional[str]] = mapped_column(String, index=True)
    patronymic: Mapped[Optional[str]] = mapped_column(String, index=True)
    gender: Mapped[str] = mapped_column(String, index=True, nullable=False)
    phone: Mapped[str] = mapped_column(String, index=True)
    birth_date: Mapped[datetime] = mapped_column(nullable=False)
    password: Mapped[bytes] = mapped_column(nullable=False)
    password_salt: Mapped[bytes] = mapped_column(nullable=False)
    role: Mapped[Role] = mapped_column(Enum(Role), default=Role.PATIENT)
    patient_tests: Mapped[List["PatientTest"]] = relationship("PatientTest", back_populates="patient",
                                                              foreign_keys="[PatientTest.patient_id]",
                                                              cascade="all, delete-orphan")
    assigned_by: Mapped[List["PatientTest"]] = relationship("PatientTest", back_populates="assigned_by",
                                                            foreign_keys="[PatientTest.assigned_by_id]",
                                                            cascade="all, delete-orphan")
    doctor_patient_patient: Mapped[List[DoctorPatient]] = relationship(back_populates="patient",
                                                                       foreign_keys="[DoctorPatient.patient_id]",
                                                                       cascade="all, delete-orphan")
    doctor_patient_doctor: Mapped[List[DoctorPatient]] = relationship(back_populates="doctor",
                                                                      foreign_keys="[DoctorPatient.doctor_id]",
                                                                      cascade="all, delete-orphan")
    tests_history: Mapped[List[TestHistory]] = relationship(back_populates="patient",
                                                            foreign_keys=[TestHistory.patient_id],
                                                            cascade="all, delete-orphan")
