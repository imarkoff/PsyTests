"use server";

import {fetchProtected} from "@/lib/fetchers";
import DoctorPatientTestService from "@/lib/services/DoctorPatientTestService";

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
    service => service.assignTest(patientId, testId)
)

export const unassignTest = async (patientId: string, assignedTestId: string) => fetchProtected(
    DoctorPatientTestService,
    service => service.unassignTest(patientId, assignedTestId)
)