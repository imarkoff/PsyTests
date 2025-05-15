import createApiRoute from "@/lib/utils/createApiRoute";
import DoctorPatientTestService from "@/lib/services/DoctorPatientTestService";

export const DELETE = createApiRoute(
    DoctorPatientTestService,
    async (service, _, params) => {
        const { patientId, assignedTestId } = await params;
        return service.unassignTest(patientId, assignedTestId);
    }
)
