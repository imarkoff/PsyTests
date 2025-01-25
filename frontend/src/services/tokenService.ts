import api from "@/api/api";

export const endpoint = "/token";

export const refreshToken = async () => {
    api.defaults.withCredentials = true;
    const { data } = await api.post<string>(`${endpoint}/refresh`);
    api.defaults.withCredentials = false;
    return data;
}
