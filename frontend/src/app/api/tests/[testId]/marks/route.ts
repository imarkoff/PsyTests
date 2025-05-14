import withApiAuth from "@/lib/auth/withApiAuth";
import TestService from "@/lib/services/TestService";

/** Get additional info about marks for a test */
export const GET = withApiAuth(async (
    api,
    _,
    { params }: { params: Promise<{ testId: string }> }
) => {
    const { testId } = await params;

    const testService = new TestService(api);
    return await testService.getTestMarks(testId);
})