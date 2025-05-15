import createApiRoute from "@/lib/utils/createApiRoute";
import DoctorPatientTestService from "@/lib/services/DoctorPatientTestService";

export const PATCH = createApiRoute(
    DoctorPatientTestService,
    async (service, _, params) => {
        const { patientId, testId } = await params;
        return service.revalidateTestResult(patientId, testId);
    }
)