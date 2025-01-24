/**
 * Service for getting user data
 */

import apiPrivate from "@/api/apiPrivate";
import api from "@/api/api";
import User from "@/schemas/User";

export const endpoint = "/users";

export const getMe = async () =>
    await apiPrivate.get<User>(`${endpoint}/me`);

export const getUser = async (userId: string) =>
    await api.get<User>(`${endpoint}/${userId}`);