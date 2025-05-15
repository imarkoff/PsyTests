import PatientTestService from "@/lib/services/PatientTestService";
import createApiRoute from "@/lib/utils/createApiRoute";

export const GET = createApiRoute(
    PatientTestService,
    service => service.getTestsHistory()
);