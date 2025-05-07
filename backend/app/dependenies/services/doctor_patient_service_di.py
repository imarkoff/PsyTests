from fastapi import Depends

from app.dependenies.repositories import get_doctor_patient_repository
from app.dependenies.services import get_user_service
from app.dependenies.services.shared_doctor_patient_deps import get_doctor_patient_getter
from app.dependenies.services.shared_patient_test_deps import get_patient_test_unassigner
from app.services.patients.doctor_patient_service import *


def get_doctor_patient_deleter(
        repository=Depends(get_doctor_patient_repository),
        unassigner=Depends(get_patient_test_unassigner)
):
    return DoctorPatientDeleter(repository, patient_test_unassigner=unassigner)


def get_doctor_patient_service(
        repository=Depends(get_doctor_patient_repository),
        user_service=Depends(get_user_service),
        getter=Depends(get_doctor_patient_getter),
        deleter=Depends(get_doctor_patient_deleter)
) -> DoctorPatientService:
    finder = DoctorPatientFinder(repository, user_service)
    creator = DoctorPatientCreator(repository, user_service)
    changer = DoctorPatientChanger(repository)
    return DoctorPatientService(
        doctor_patient_getter=getter,
        doctor_patient_finder=finder,
        doctor_patient_creator=creator,
        doctor_patient_changer=changer,
        doctor_patient_deleter=deleter
    )
