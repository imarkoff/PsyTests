import {fetchProtected, fetchPublic} from "@/lib/fetchers";
import UserService from "@/lib/services/UserService";

export const getMe = () => fetchProtected(
    UserService,
    service => service.getMe(),
)

export const getUser = (userId: string) => fetchPublic(
    UserService,
    service => service.getUser(userId)
)