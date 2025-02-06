/**
 * Service for authentication
 */

import api from "@/api/api";
import apiPrivate, {setToken} from "@/api/apiPrivate";
import UserLogin from "@/schemas/UserLogin";

export const endpoint = "/auth";

export const login = async (data: UserLogin) => {
    const { data: token } = await api.post<string>(`${endpoint}/login`, data);
    setToken(token);
};

export const logout = async () => {
    await apiPrivate.post<void>(`${endpoint}/logout`);
    setToken(undefined);
};