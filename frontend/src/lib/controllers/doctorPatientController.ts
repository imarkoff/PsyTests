"use server";

import {fetchProtected} from "@/lib/fetchers";
import DoctorPatientService from "@/lib/services/DoctorPatientService";
import PatientCreate from "@/types/forms/PatientCreate";

export const getAllPatients = async () => fetchProtected(
    DoctorPatientService,
    service => service.getPatients()
)

export const createPatient = async (patient: PatientCreate) => fetchProtected(
    DoctorPatientService,
    service => service.createPatient(patient)
)

export const findPatient = async (search: string) => fetchProtected(
    DoctorPatientService,
    service => service.findPatient(search)
)

export const getPatientById = async (patientId: string) => fetchProtected(
    DoctorPatientService,
    service => service.getPatient(patientId)
)

export const addPatient = async (patientId: string) => fetchProtected(
    DoctorPatientService,
    service => service.addPatient(patientId)
)

export const removePatient = async (patientId: string) => fetchProtected(
    DoctorPatientService,
    service => service.removePatient(patientId)
)

export const markPatientAsRead = async (patientId: string) => fetchProtected(
    DoctorPatientService,
    service => service.readPatient(patientId)
)

export const changePatientStatus = async (patientId: string, isActive: boolean) => fetchProtected(
    DoctorPatientService,
    service => service.changePatientStatus(patientId, isActive)
)