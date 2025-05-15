import createApiRoute from "@/lib/utils/createApiRoute";
import DoctorPatientTestService from "@/lib/services/DoctorPatientTestService";

export const GET = createApiRoute(
    DoctorPatientTestService,
    async (service, _, params) => {
        const { patientId } = await params;
        return service.getPatientTests(patientId);
    }
)