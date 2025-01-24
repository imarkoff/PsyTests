/**
 * Service for patient tests
 */

import apiPrivate from "@/api/apiPrivate";
import PatientTest from "@/schemas/PatientTest";
import PassTest from "@/schemas/PassTest";
import TestResult from "@/schemas/TestResult";

export const endpoint = "/patient/tests";

export const getTests = async () =>
    await apiPrivate.get<PatientTest[]>(endpoint);

export const passTest = async (attempt: PassTest) =>
    await apiPrivate.post<TestResult>(endpoint, attempt);

export const getTestsHistory = async () =>
    await apiPrivate.get<TestResult[]>(`${endpoint}/history`);

export const getTestResult = async (assignedTestId: string) =>
    await apiPrivate.get<TestResult>(`${endpoint}/${assignedTestId}`);