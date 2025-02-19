/**
 * Service for doctor's patients tests
 */

import apiPrivate from "@/api/apiPrivate";
import PatientTest from "@/schemas/PatientTest";
import TestResult from "@/schemas/TestResult";
import downloadFile from "@/utils/downloadFile";
import extractFilename from "@/utils/extractFilename";


export const endpoint = "/doctor/patients";
export const getEndpoint = (patientId: string) => `${endpoint}/${patientId}/tests`;

export const getPatientTests = async (patientId: string) =>
    await apiPrivate.get<PatientTest[]>(getEndpoint(patientId)).then(res => res.data);

export const getHistory = async (patientId: string) =>
    await apiPrivate.get<TestResult[]>(`${getEndpoint(patientId)}/history`).then(res => res.data);

export const getTestResult = async (patientId: string, testId: string) =>
    await apiPrivate.get<TestResult>(`${getEndpoint(patientId)}/history/${testId}`).then(res => res.data);

export const exportTestResult = async (patientId: string, testId: string) =>
    await apiPrivate.get<Blob>(`${getEndpoint(patientId)}/history/${testId}/export`, {responseType: 'blob'})
        .then(res => {
            const fileName = extractFilename(res.headers['content-disposition']);
            downloadFile(res.data, fileName);
        });

export const assignTest = async (patientId: string, testId: string) =>
    await apiPrivate.post<PatientTest>(`${getEndpoint(patientId)}/${testId}`).then(res => res.data);

export const unassignTest = async (patientId: string, assignedTestId: string) =>
    await apiPrivate.delete<void>(`${getEndpoint(patientId)}/${assignedTestId}`).then(res => res.data);