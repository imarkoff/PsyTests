import PatientTestService from "@/lib/services/PatientTestService";
import createApiRoute from "@/lib/utils/createApiRoute";

export const GET = createApiRoute(
    PatientTestService,
    async (service, _, params) => {
        const { assignedTestId } = await params;
        return await service.getAssignedTestById(assignedTestId);
    }
)