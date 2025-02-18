/**
 * Service for managing patients of a doctor.
 */

import apiPrivate from "@/api/apiPrivate";
import PatientCreate from "@/schemas/PatientCreate";
import DoctorPatient from "@/schemas/DoctorPatient";
import PatientSearch from "@/schemas/PatientSearch";

export const endpoint = "/doctor/patients";

export const getPatients = async () =>
    await apiPrivate.get<DoctorPatient[]>(endpoint).then(res => res.data);

export const createPatient = async (patient: PatientCreate) =>
    await apiPrivate.post<DoctorPatient>(endpoint, patient).then(res => res.data);

export const findPatient = async (search: string) =>
    await apiPrivate.get<PatientSearch>(`${endpoint}/find`, { params: { search } }).then(res => res.data);

export const getPatient = async (patientId: string) =>
    await apiPrivate.get<DoctorPatient>(`${endpoint}/${patientId}`).then(res => res.data);

export const addPatient = async (patientId: string) =>
    await apiPrivate.post<DoctorPatient>(`${endpoint}/${patientId}`).then(res => res.data);

export const removePatient = async (patientId: string) =>
    await apiPrivate.delete<void>(`${endpoint}/${patientId}`).then(res => res.data);

export const readPatient = async (patientId: string) =>
    await apiPrivate.patch<void>(`${endpoint}/${patientId}/read`).then(res => res.data);

export const changePatientStatus = async (patientId: string, isActive: boolean) =>
    await apiPrivate.patch<void>(`${endpoint}/${patientId}/status`, null, { params: { status: isActive } })
        .then(res => res.data);