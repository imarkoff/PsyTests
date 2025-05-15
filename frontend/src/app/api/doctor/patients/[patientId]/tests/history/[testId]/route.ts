import DoctorPatientTestService from "@/lib/services/DoctorPatientTestService";
import createApiRoute from "@/lib/utils/createApiRoute";

export const GET = createApiRoute(
    DoctorPatientTestService,
    async (service, _, params) => {
        const { patientId, testId } = await params;
        return service.getTestResult(patientId, testId);
    }
)