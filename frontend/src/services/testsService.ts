/**
 * Service for tests
 */

import apiPrivate from "@/api/apiPrivate";
import Test, {TestMark} from "@/schemas/Test";
import api from "@/api/api";
import TestBase from "@/schemas/TestBase";

export const endpoint = "/tests";

export const getTests = async () =>
    await apiPrivate.get<TestBase[]>(endpoint).then(res => res.data);

export const getTest = async (testId: string) =>
    await apiPrivate.get<Test>(`${endpoint}/${testId}`).then(res => res.data);

export const testImage =
    (testId: string, modulePath: string | undefined | null, imagePath: string) =>
    `${api.defaults.baseURL}${endpoint}/${testId}/image?image_path=${imagePath}${modulePath ? `&module_path=${modulePath}` : ""}`;

export const getTestMarks = async (testId: string) =>
    await apiPrivate.get<TestMark[]>(`${endpoint}/${testId}/marks`).then(res => res.data);