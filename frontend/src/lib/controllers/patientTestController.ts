"use server";

import {fetchProtected} from "@/lib/fetchers";
import PatientTestService from "@/lib/services/PatientTestService";
import PassTest from "@/types/forms/PassTest";

export const getAssignedTests = async () => fetchProtected(
    PatientTestService,
    service => service.getAssignedTests()
)

export const passTest = async (attempt: PassTest) => fetchProtected(
    PatientTestService,
    service => service.passTest(attempt)
)

export const getTestsHistory = async () => fetchProtected(
    PatientTestService,
    service => service.getTestsHistory()
)

export const getAssignedTestById = async (assignedTestId: string) => fetchProtected(
    PatientTestService,
    service => service.getAssignedTestById(assignedTestId)
)