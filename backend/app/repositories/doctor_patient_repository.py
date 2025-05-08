from typing import cast

from pydantic import UUID4
from sqlalchemy.orm import Session

from app.db.models.doctor_patient import DoctorPatient
from app.repositories.sql_alchemy_repository import SQLAlchemyRepository


class DoctorPatientRepository(SQLAlchemyRepository):
    def __init__(self, db: Session):
        super().__init__(db)

    async def get_by_doctor_id(self, doctor_id: UUID4) -> list[DoctorPatient]:
        result = self.db.query(DoctorPatient).filter(
            DoctorPatient.doctor_id == doctor_id,
            DoctorPatient.is_active.is_(True)
        ).all()
        return cast(list[DoctorPatient], result)

    async def get_by_doctor_id_and_patient_id(self, doctor_id: UUID4, patient_id: UUID4) -> DoctorPatient | None:
        return self.db.query(DoctorPatient).filter(
            DoctorPatient.doctor_id == doctor_id,
            DoctorPatient.patient_id == patient_id
        ).first()

    async def get_by_patient_id_list(self, doctor_id: UUID4, patients: list[UUID4]) -> list[DoctorPatient]:
        result = self.db.query(DoctorPatient).filter(
            DoctorPatient.doctor_id == doctor_id,
            DoctorPatient.patient_id.in_(patients)
        ).all()
        return cast(list[DoctorPatient], result)

    async def create_doctor_patient(self, doctor_patient: DoctorPatient):
        self.db.add(doctor_patient)
        self.db.commit()
        self.db.refresh(doctor_patient)

    async def delete_doctor_patient(self, doctor_patient: DoctorPatient):
        self.db.delete(doctor_patient)
        self.db.commit()

    async def change_attention(self, patient_id: UUID4, needs_attention: bool):
        self.db.query(DoctorPatient).filter(
            DoctorPatient.patient_id == patient_id
        ).update(
            {DoctorPatient.needs_attention: needs_attention},
            synchronize_session=False
        )
        self.db.commit()

    async def change_status(self, patient_id: UUID4, is_active: bool) -> None:
        self.db.query(DoctorPatient).filter(
            DoctorPatient.patient_id == patient_id
        ).update(
            {DoctorPatient.is_active: is_active},
            synchronize_session=False
        )
        self.db.commit()
