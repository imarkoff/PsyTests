"use server";

import {fetchProtected} from "@/lib/fetchers";
import DoctorPatientTestService from "@/lib/services/DoctorPatientTestService";
import {AxiosError} from "axios";

export const getAllPatientTests = async (patientId: string) => fetchProtected(
    DoctorPatientTestService,
    service => service.getPatientTests(patientId)
)

export const getTestResultsByPatient = async (patientId: string) => fetchProtected(
    DoctorPatientTestService,
    service => service.getTestResultsByPatient(patientId)
)

export const getTestResult = async (patientId: string, testId: string) => fetchProtected(
    DoctorPatientTestService,
    service => service.getTestResult(patientId, testId)
)

export const exportTestResult = async (patientId: string, testId: string) => fetchProtected(
    DoctorPatientTestService,
    service => service.exportTestResult(patientId, testId)
)

export const revalidateTestResult = async (patientId: string, testId: string) => fetchProtected(
    DoctorPatientTestService,
    service => service.revalidateTestResult(patientId, testId)
)

export const assignTest = async (patientId: string, testId: string) => fetchProtected(
    DoctorPatientTestService,
    async (service) => {
        try {
            return await service.assignTest(patientId, testId);
        }
        catch (error) {
            if (error instanceof AxiosError && error.response?.status === 409) {
                throw new Error("Вибраний вами тест вже назначено пацієнту");
            }
            throw error;
        }
    }
)

export const unassignTest = async (patientId: string, assignedTestId: string) => fetchProtected(
    DoctorPatientTestService,
    service => service.unassignTest(patientId, assignedTestId)
)