import {AxiosInstance} from "axios";
import TestBase from "@/schemas/TestBase";
import CsvData from "@/schemas/CsvData";

export default class TestService {
    constructor(private readonly api: AxiosInstance) {}

    endpoint = "/tests";

    getTests = async () =>
        await this.api.get<TestBase[]>(this.endpoint).then(res => res.data);

    getTest = async <T extends TestBase>(testId: string) =>
        await this.api.get<T>(`${this.endpoint}/${testId}`).then(res => res.data);

    testImage = async (testId: string, imagePath: string) =>
        await this.api.get(
            `/tests/${testId}/image?image_path=${imagePath}`,
            {responseType: 'arraybuffer'}
        );

    getTestMarks = async (testId: string) =>
        await this.api.get<CsvData>(`${this.endpoint}/${testId}/marks`).then(res => res.data);
}