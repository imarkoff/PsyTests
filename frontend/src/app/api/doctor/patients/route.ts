import DoctorPatientService from "@/lib/services/DoctorPatientService";
import PatientCreate from "@/schemas/PatientCreate";
import createApiRoute from "@/lib/utils/createApiRoute";

export const GET = createApiRoute(
    DoctorPatientService,
    service => service.getPatients()
)

export const POST = createApiRoute(
    DoctorPatientService,
    async (service, request) => {
        const newPatient: PatientCreate = await request.json();
        return await service.createPatient(newPatient);
    }
)