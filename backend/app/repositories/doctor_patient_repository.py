import datetime
from typing import cast
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.doctor_patient import DoctorPatient
from app.db.models.user import User
from app.repositories.sql_alchemy_repository import SQLAlchemyRepository
from app.schemas.pagination import PaginationParams, PaginatedList
from app.utils.sqlalchemy import SQLAlchemyPaginator


class DoctorPatientRepository(SQLAlchemyRepository):
    def __init__(self, db: Session):
        super().__init__(db)

    async def get_by_doctor_id(
        self,
        doctor_id: UUID,
        pagination_params: PaginationParams
    ) -> PaginatedList[DoctorPatient]:
        query = self.db.query(DoctorPatient).filter(
            DoctorPatient.doctor_id == doctor_id,
            DoctorPatient.unassigned_at.is_(None),
            DoctorPatient.deleted_at.is_(None)
        )

        paginated_doctor_patients = SQLAlchemyPaginator.paginate(
            model=DoctorPatient,
            query=query,
            pagination_params=pagination_params,
            joins=[DoctorPatient.patient],
            filters_fields=[
                User.name,
                User.surname,
                User.patronymic,
                User.phone,
                DoctorPatient.needs_attention,
                DoctorPatient.assigned_at
            ]
        )

        return paginated_doctor_patients

    async def get_by_doctor_id_and_patient_id(
        self,
        doctor_id: UUID,
        patient_id: UUID
    ) -> DoctorPatient | None:
        return self.db.query(DoctorPatient).filter(
            DoctorPatient.doctor_id == doctor_id,
            DoctorPatient.patient_id == patient_id,
            DoctorPatient.deleted_at.is_(None)
        ).first()

    async def get_by_patient_id_list(
        self,
        doctor_id: UUID,
        patients: list[UUID]
    ) -> list[DoctorPatient]:
        result = self.db.query(DoctorPatient).filter(
            DoctorPatient.doctor_id == doctor_id,
            DoctorPatient.patient_id.in_(patients),
            DoctorPatient.deleted_at.is_(None)
        ).all()
        return cast(list[DoctorPatient], result)

    async def create_doctor_patient(self, doctor_patient: DoctorPatient):
        self.db.add(doctor_patient)
        self.db.commit()
        self.db.refresh(doctor_patient)

    async def delete_doctor_patient(self, doctor_patient: DoctorPatient):
        self.db.delete(doctor_patient)
        self.db.commit()

    async def delete_all_patients_from_doctor(self, doctor_id: UUID):
        self.db.query(DoctorPatient).filter(
            DoctorPatient.doctor_id == doctor_id
        ).update(
            {
                DoctorPatient.deleted_at: datetime.now(datetime.UTC),
                DoctorPatient.needs_attention: False,
                DoctorPatient.unassigned_at: (
                    DoctorPatient.assigned_at
                    if DoctorPatient.unassigned_at is not None
                    else datetime.now(datetime.UTC)
                )
            },
            synchronize_session=False
        )
        self.db.commit()

    async def delete_all_relations_of_patient(self, patient_id: UUID):
        self.db.query(DoctorPatient).filter(
            DoctorPatient.patient_id == patient_id
        ).update(
            {
                DoctorPatient.deleted_at: datetime.now(datetime.UTC),
                DoctorPatient.needs_attention: False,
                DoctorPatient.unassigned_at: (
                    DoctorPatient.assigned_at
                    if DoctorPatient.unassigned_at is not None
                    else datetime.now(datetime.UTC)
                )
            },
            synchronize_session=False
        )
        self.db.commit()

    async def change_attention(self, patient_id: UUID, needs_attention: bool):
        self.db.query(DoctorPatient).filter(
            DoctorPatient.patient_id == patient_id,
            DoctorPatient.deleted_at.is_(None)
        ).update(
            {DoctorPatient.needs_attention: needs_attention},
            synchronize_session=False
        )
        self.db.commit()

    async def change_status(self, patient_id: UUID, is_active: bool) -> None:
        self.db.query(DoctorPatient).filter(
            DoctorPatient.patient_id == patient_id,
            DoctorPatient.deleted_at.is_(None)
        ).update(
            {
                DoctorPatient.unassigned_at: (
                    datetime.now(datetime.UTC)
                    if not is_active else None
                )
            },
            synchronize_session=False
        )
        self.db.commit()
