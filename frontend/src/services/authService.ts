/**
 * Service for authentication
 */

import api from "@/api/api";
import {setToken} from "@/api/apiPrivate";

export const endpoint = "/auth";

export const login = async (phone: string, password: string) => {
    const response = await api.post<string>(`${endpoint}/login`, {phone, password});
    setToken(response.data);
    return response;
};

export const logout = async () => {
    const response = await api.post<void>(`${endpoint}/logout`);
    setToken(undefined);
    return response;
};