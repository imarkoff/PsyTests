import UserService from "@/lib/services/UserService";
import createApiRoute from "@/lib/utils/createApiRoute";

/** Gets info about logged user */
export const GET = createApiRoute(
    UserService,
    service => service.getMe()
)