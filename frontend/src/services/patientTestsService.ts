/**
 * Service for patient tests
 */

import apiPrivate from "@/api/apiPrivate";
import PatientTest from "@/schemas/PatientTest";
import PassTest from "@/schemas/PassTest";
import TestResultShort from "@/schemas/TestResultShort";

export const endpoint = "/patient/tests";

export const getAssignedTests = () =>
    apiPrivate.get<PatientTest[]>(endpoint).then(res => res.data);

export const passTest = (attempt: PassTest) =>
    apiPrivate.post<TestResultShort>(endpoint, attempt).then(res => res.data);

export const getTestsHistory = () =>
    apiPrivate.get<TestResultShort[]>(`${endpoint}/history`).then(res => res.data);

export const getTest = (assignedTestId: string) =>
    apiPrivate.get<PatientTest>(`${endpoint}/${assignedTestId}`).then(res => res.data);