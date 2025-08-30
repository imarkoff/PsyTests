import PatientTest from "@/types/models/PatientTest";
import TestResult from "@/types/models/TestResult";
import {AxiosInstance} from "axios";

export default class DoctorPatientTestService {
    constructor(private readonly api: AxiosInstance) {}

    endpoint = "/doctor/patients";
    private getEndpoint = (patientId: string) => `${this.endpoint}/${patientId}/tests`;

    getPatientTests = async (patientId: string) =>
        await this.api.get<PatientTest[]>(this.getEndpoint(patientId))
            .then(res => res.data);

    getTestResultsByPatient = async (patientId: string) =>
        await this.api.get<TestResult[]>(`${this.getEndpoint(patientId)}/history`)
            .then(res => res.data);

    getTestResult = async (patientId: string, testId: string) =>
        await this.api.get<TestResult>(`${this.getEndpoint(patientId)}/history/${testId}`)
            .then(res => res.data);

    /**
     * Exports the test result for a patient.
     * If returning from api, the "content-disposition" and "content-type" headers needs to be set in NextResponse.
     * @returns An object containing the data and headers - content-disposition and content-type.
     */
    exportTestResult = async (patientId: string, testId: string) =>
        await this.api.get<ArrayBuffer>(`${this.getEndpoint(patientId)}/history/${testId}/export`, {responseType: 'arraybuffer'})
            .then(res => ({
                data: res.data,
                contentDisposition: res.headers['content-disposition'],
                contentType: res.headers['content-type']
            }));

    revalidateTestResult = async (patientId: string, testId: string) =>
        await this.api.patch<TestResult>(`${this.getEndpoint(patientId)}/history/${testId}/revalidate`)
            .then(res => res.data);

    assignTest = async (patientId: string, testId: string) =>
        await this.api.post<PatientTest>(`${this.getEndpoint(patientId)}/${testId}`).then(res => res.data);

    unassignTest = async (patientId: string, assignedTestId: string) =>
        await this.api.delete<void>(`${this.getEndpoint(patientId)}/${assignedTestId}`).then(res => res.data);
}