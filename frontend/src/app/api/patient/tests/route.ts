import PatientTestService from "@/lib/services/PatientTestService";
import createApiRoute from "@/lib/utils/createApiRoute";

export const GET = createApiRoute(
    PatientTestService,
    service => service.getAssignedTests()
)

export const POST = createApiRoute(
    PatientTestService,
    async (service, req) => {
        const data = await req.json();
        return service.passTest(data);
    }
)