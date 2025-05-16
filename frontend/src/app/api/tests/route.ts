import TestService from "@/lib/services/TestService";
import createApiRoute from "@/lib/utils/createApiRoute";

export const GET = createApiRoute(
    TestService,
    service => service.getTests()
)