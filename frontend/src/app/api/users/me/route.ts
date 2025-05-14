import withApiAuth from "@/lib/auth/withApiAuth";
import UserService from "@/lib/services/UserService";

/** Gets info about logged user */
export const GET = withApiAuth(async (api) => {
    const service = new UserService(api);
    return await service.getMe();
})