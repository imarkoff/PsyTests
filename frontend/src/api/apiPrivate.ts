import axios from "axios";
import {refreshToken} from "@/services/tokenService";

let token: string | undefined = undefined;

const apiPrivate = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

apiPrivate.interceptors.request.use(
    (config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error?.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            token = await refreshToken();
            return apiPrivate(originalRequest);
        }
        return Promise.reject(error);
    }
);

export const setToken = (newToken?: string) => {
    token = newToken;
}

export default apiPrivate;