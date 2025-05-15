import createApiRoute from "@/lib/utils/createApiRoute";
import DoctorPatientService from "@/lib/services/DoctorPatientService";

export const GET = createApiRoute(
    DoctorPatientService,
    async (service, _, params) => {
        const { patientId } = await params;
        return await service.getPatient(patientId);
    }
)

export const POST = createApiRoute(
    DoctorPatientService,
    async (service, _, params) => {
        const { patientId } = await params;
        return await service.addPatient(patientId);
    }
)

export const DELETE = createApiRoute(
    DoctorPatientService,
    async (service, _, params) => {
        const { patientId } = await params;
        return await service.removePatient(patientId);
    }
)