/**
 * Service for authentication
 */

import api from "@/api/api";
import apiPrivate, {setToken} from "@/api/apiPrivate";

export const endpoint = "/auth";

export const login = async (phone: string, password: string) => {
    const { data } = await api.post<string>(`${endpoint}/login`, {phone, password});
    setToken(data);
    return data;
};

export const logout = async () => {
    await apiPrivate.post<void>(`${endpoint}/logout`);
    setToken(undefined);
};