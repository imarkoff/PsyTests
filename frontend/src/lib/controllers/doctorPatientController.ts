"use server";

import {fetchProtected} from "@/lib/fetchers";
import DoctorPatientService from "@/lib/services/DoctorPatientService";
import UserCreate from "@/types/forms/UserCreate";
import {AxiosError} from "axios";
import PaginationParams from "@/types/pagination/PaginationParams";
import DoctorPatient from "@/types/models/DoctorPatient";
import convertPaginationParamsToQuery from "@/utils/convertPaginationParamsToQuery";

export const getAllPatients = async (
    paginationParams: PaginationParams<DoctorPatient>
) => fetchProtected(
    DoctorPatientService,
    service => service.getPatients(
        convertPaginationParamsToQuery(paginationParams)
    )
)

export const createPatient = async (patient: UserCreate) => fetchProtected(
    DoctorPatientService,
    async (service) => {
        try {
            return await service.createPatient(patient);
        }
        catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    throw new Error("Пацієнт з таким номером телефону вже існує.");
                } else {
                    throw new Error(`Помилка при створенні пацієнта: ${error.message}`);
                }
            }
        }
    }
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