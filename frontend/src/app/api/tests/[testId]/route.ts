import withApiAuth from "@/lib/auth/withApiAuth";
import TestService from "@/lib/services/TestService";
import UserService from "@/lib/services/UserService";
import {AxiosInstance} from "axios";

export const GET = withApiAuth(async (
    api,
    _,
    { params }: { params: Promise<{testId: string}> }
) => {
    const { testId } = await params;
    const testService = new TestService(api);

    await refreshAccessToken(api);

    return await testService.getTest(testId);
})

// access token may be expired, so doctor may see not all test data
const refreshAccessToken = async (api: AxiosInstance) => {
    const userService = new UserService(api);
    try { await userService.getMe(); }
    catch { }
}