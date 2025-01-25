/**
 * Service for managing patients of a doctor.
 */

import apiPrivate from "@/api/apiPrivate";
import User from "@/schemas/User";
import PatientCreate from "@/schemas/PatientCreate";
import PatientInfo from "@/schemas/PatientInfo";

export const endpoint = "/doctor/patients";

export const getPatients = async () =>
    await apiPrivate.get<User[]>(endpoint).then(res => res.data);

export const createPatient = async (patient: PatientCreate) =>
    await apiPrivate.post<User>(endpoint, patient).then(res => res.data);

export const findPatient = async (search: string) =>
    await apiPrivate.get<User[]>(`${endpoint}/find`, { params: { search } }).then(res => res.data);

export const getPatient = async (patientId: string) =>
    await apiPrivate.get<PatientInfo>(`${endpoint}/${patientId}`).then(res => res.data);

export const addPatient = async (patientId: string) =>
    await apiPrivate.post<User>(`${endpoint}/${patientId}`).then(res => res.data);

export const removePatient = async (patientId: string) =>
    await apiPrivate.delete<void>(`${endpoint}/${patientId}`).then(res => res.data);