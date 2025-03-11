/**
 * Service for tests
 */

import apiPrivate from "@/api/apiPrivate";
import api from "@/api/api";
import TestBase from "@/schemas/TestBase";
import CsvData from "@/schemas/CsvData";

export const endpoint = "/tests";

export const getTests = async () =>
    await apiPrivate.get<TestBase[]>(endpoint).then(res => res.data);

export const getTest = async <T extends TestBase>(testId: string) =>
    await apiPrivate.get<T>(`${endpoint}/${testId}`).then(res => res.data);

export const testImage =
    (testId: string, modulePath: string | undefined | null, imagePath: string) =>
    `${api.defaults.baseURL}${endpoint}/${testId}/image?image_path=${imagePath}${modulePath ? `&module_path=${modulePath}` : ""}`;

// you may need additional request or not. that's depends on your test type
export const getTestMarks = async (testId: string) =>
    await apiPrivate.get<CsvData>(`${endpoint}/${testId}/marks`).then(res => res.data);