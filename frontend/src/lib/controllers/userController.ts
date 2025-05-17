"use server";

import {fetchProtected, fetchPublic} from "@/lib/fetchers";
import UserService from "@/lib/services/UserService";

export const getMe = async () => fetchProtected(
    UserService,
    service => service.getMe(),
)

export const getUser = async (userId: string) => fetchPublic(
    UserService,
    service => service.getUser(userId)
)