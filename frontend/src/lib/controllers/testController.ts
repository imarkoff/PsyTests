"use server";

import {fetchProtected, fetchPublic} from "@/lib/fetchers";
import TestService from "@/lib/services/TestService";

export const getAllTests = async () => fetchProtected(
    TestService,
    service => service.getTests()
)

export const getTestById = async (testId: string) => fetchProtected(
    TestService,
    service => service.getTest(testId)
)

export const getTestImage = async (testId: string, imagePath: string) => fetchPublic(
    TestService,
    service => service.testImage(testId, imagePath)
)

export const getTestMarks = async (testId: string) => fetchProtected(
    TestService,
    service => service.getTestMarks(testId)
)