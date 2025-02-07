/**
 * Service for doctor's patients tests
 */

import apiPrivate from "@/api/apiPrivate";
import PatientTest from "@/schemas/PatientTest";
import TestResult from "@/schemas/TestResult";

export const endpoint = "/doctor/patients";
export const getEndpoint = (patientId: string) => `${endpoint}/${patientId}/tests`;

export const getTests = async (patientId: string) =>
    await apiPrivate.get<PatientTest[]>(getEndpoint(patientId)).then(response => response.data);

export const getHistory = async (patientId: string) =>
    await apiPrivate.get<TestResult[]>(`${getEndpoint(patientId)}/history`).then(response => response.data);

export const assignTest = async (patientId: string, testId: string) =>
    await apiPrivate.post<PatientTest>(`${getEndpoint(patientId)}/${testId}`).then(response => response.data);

export const unassignTest = async (patientId: string, assignedTestId: string) =>
    await apiPrivate.delete<void>(`${getEndpoint(patientId)}/${assignedTestId}`).then(response => response.data);