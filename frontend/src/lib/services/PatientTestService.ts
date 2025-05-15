import PatientTest from "@/schemas/PatientTest";
import PassTest from "@/schemas/PassTest";
import TestResultShort from "@/schemas/TestResultShort";
import {AxiosInstance} from "axios";

export default class PatientTestService {
    constructor(private readonly api: AxiosInstance) {}

    endpoint = "/patient/tests";

    getAssignedTests = () =>
        this.api.get<PatientTest[]>(this.endpoint).then(res => res.data);

    passTest = (attempt: PassTest) =>
        this.api.post<TestResultShort>(this.endpoint, attempt).then(res => res.data);

    getTestsHistory = () =>
        this.api.get<TestResultShort[]>(`${this.endpoint}/history`).then(res => res.data);

    getAssignedTestById = (assignedTestId: string) =>
        this.api.get<PatientTest>(`${this.endpoint}/${assignedTestId}`).then(res => res.data);
}