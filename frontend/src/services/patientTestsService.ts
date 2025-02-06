/**
 * Service for patient tests
 */

import apiPrivate from "@/api/apiPrivate";
import PatientTest from "@/schemas/PatientTest";
import PassTest from "@/schemas/PassTest";
import TestShortResult from "@/schemas/TestShortResult";
import TestResult from "@/schemas/TestResult";

export const endpoint = "/patient/tests";

export const getTests = () =>
    apiPrivate.get<PatientTest[]>(endpoint).then(res => res.data);

export const passTest = (attempt: PassTest) =>
    apiPrivate.post<TestResult>(endpoint, attempt).then(res => res.data);

export const getTestsHistory = () =>
    apiPrivate.get<TestShortResult[]>(`${endpoint}/history`).then(res => res.data);

export const getTest = (assignedTestId: string) =>
    apiPrivate.get<PatientTest>(`${endpoint}/${assignedTestId}`).then(res => res.data);