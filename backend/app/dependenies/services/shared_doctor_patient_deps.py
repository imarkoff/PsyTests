from fastapi import Depends

from app.dependenies.repositories import get_doctor_patient_repository
from app.services.patients.doctor_patient_service import DoctorPatientGetter


def get_doctor_patient_getter(repository=Depends(get_doctor_patient_repository)):
    return DoctorPatientGetter(repository)