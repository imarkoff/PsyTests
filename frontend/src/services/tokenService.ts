import apiPrivate, {setToken} from "@/api/apiPrivate";

export const endpoint = "/token";

export const refreshToken = async () => {
    const response = await apiPrivate.post<string>(`${endpoint}/refresh`);
    setToken(response.data);
    return response;
}
