import TestService from "@/lib/services/TestService";
import createApiRoute from "@/lib/utils/createApiRoute";

/** Get additional info about marks for a test */
export const GET = createApiRoute(
    TestService,
    async (service, _, params) => {
        const { testId } = await params;
        return await service.getTestMarks(testId);
    }
)