from datetime import datetime, UTC
from typing import cast
from uuid import UUID

from app.db.models.doctor_patient import DoctorPatient
from app.db.models.patient_test import PatientTest
from app.repositories.base_respository import BaseRepository


class PatientTestRepository(BaseRepository):
    async def get_by_id(self, test_id: UUID) -> PatientTest | None:
        return self.db.query(PatientTest).filter(PatientTest.id == test_id).first()

    async def get_assigned_test_by_test_id_and_patient_id(self, test_id: UUID, patient_id: UUID) -> PatientTest | None:
        return self.db.query(PatientTest).filter(
            PatientTest.patient_id == patient_id,
            PatientTest.test_id == test_id,
            PatientTest.unassigned_at == None
        ).first()

    async def get_assigned_tests_by_patient_id(self, patient_id: UUID) -> list[PatientTest]:
        result = self.db.query(PatientTest).filter(
            PatientTest.patient_id == patient_id,
            PatientTest.unassigned_at == None
        ).all()
        return cast(list[PatientTest], result)

    async def get_assigned_patient_tests_by_doctor_id(self, doctor_id: UUID, patient_id: UUID) -> list[PatientTest]:
        result = (self.db.query(PatientTest)
             .join(DoctorPatient, DoctorPatient.patient_id == PatientTest.patient_id)
             .filter(PatientTest.patient_id == patient_id,
                     DoctorPatient.doctor_id == doctor_id,
                     PatientTest.unassigned_at == None)
             .all())
        return cast(list[PatientTest], result)

    async def get_test_by_patient_id(self, patient_id: UUID, test_id: UUID) -> PatientTest | None:
        return self.db.query(PatientTest).filter(
            PatientTest.id == test_id,
            PatientTest.patient_id == patient_id
        ).first()

    async def get_test_by_doctor_id_and_patient_id(self, test_id: UUID, doctor_id: UUID, patient_id: UUID) -> PatientTest | None:
        return self.db.query(PatientTest).filter(
            PatientTest.patient_id == patient_id,
            PatientTest.id == test_id,
            DoctorPatient.doctor_id == doctor_id
        ).first()

    async def create_test(self, patient_test: PatientTest):
        self.db.add(patient_test)
        self.db.commit()

    async def unassign_test(self, patient_test: PatientTest):
        patient_test.unassigned_at = datetime.now(UTC)
        self.db.commit()

    async def unassign_patient_tests_assigned_by_doctor(self, doctor_id: UUID, patient_id: UUID):
        self.db.query(PatientTest).filter(
            PatientTest.patient_id == patient_id,
            PatientTest.assigned_by_id == doctor_id
        ).update(
            {PatientTest.unassigned_at: datetime.now(UTC)},
            synchronize_session=False
        )
        self.db.commit()
