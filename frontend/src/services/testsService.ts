/**
 * Service for tests
 */

import apiPrivate from "@/api/apiPrivate";
import Test from "@/schemas/Test";
import api from "@/api/api";

export const endpoint = "/tests";

export const getTests = async () =>
    await apiPrivate.get<Test[]>(endpoint);

export const getTest = async (testId: string) =>
    await apiPrivate.get<Test>(`${endpoint}/${testId}`);

export const testImage = (testId: string, imagePath: string) =>
    `${api.defaults.baseURL}${endpoint}/${testId}/image?image_path=${imagePath}`;