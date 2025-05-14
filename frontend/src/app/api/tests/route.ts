import withApiAuth from "@/lib/auth/withApiAuth";
import TestService from "@/lib/services/TestService";

export const GET = withApiAuth(async (api) => {
    const testService = new TestService(api);
    return await testService.getTests();
})