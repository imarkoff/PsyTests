import {AxiosInstance} from "axios";
import DoctorPatient from "@/schemas/DoctorPatient";
import PatientCreate from "@/schemas/PatientCreate";
import PatientSearch from "@/schemas/PatientSearch";

export default class DoctorPatientService {
    constructor(private readonly api: AxiosInstance) {}

    endpoint = "/doctor/patients";

    getPatients = async () =>
        await this.api.get<DoctorPatient[]>(this.endpoint)
            .then(res => res.data);

    createPatient = async (patient: PatientCreate) =>
        await this.api.post<DoctorPatient>(this.endpoint, patient)
            .then(res => res.data);

    findPatient = async (search: string) =>
        await this.api.get<PatientSearch>(`${this.endpoint}/find`, { params: { search } })
            .then(res => res.data);

    getPatient = async (patientId: string) =>
        await this.api.get<DoctorPatient>(`${this.endpoint}/${patientId}`)
            .then(res => res.data);

    addPatient = async (patientId: string) =>
        await this.api.post<DoctorPatient>(`${this.endpoint}/${patientId}`)
            .then(res => res.data);

    removePatient = async (patientId: string) =>
        await this.api.delete<void>(`${this.endpoint}/${patientId}`)
            .then(res => res.data);

    readPatient = async (patientId: string) =>
        await this.api.patch<void>(`${this.endpoint}/${patientId}/read`)
            .then(res => res.data);

    changePatientStatus = async (patientId: string, isActive: boolean) =>
        await this.api.patch<void>(`${this.endpoint}/${patientId}/status`, null, { params: { status: isActive } })
            .then(res => res.data);
}