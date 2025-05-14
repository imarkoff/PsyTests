import {getAccessToken, serializeAccessToken} from "@/lib/auth/tokenManager";
import fillCookies from "@/lib/utils/fillCookies";
import {headers} from "next/headers";
import createApiInstance, { defaultApi } from "@/lib/api-client/createApiInstance";
import TokenService from "@/lib/services/TokenService";

/**
 * Creates an Axios instance for making API requests with authentication.
 */
export default async function createPrivateApiInstance() {
    const accessToken = await getAccessToken();
    const headers = new Headers();

    const instance = createApiInstance({ withCredentials: true });

    instance.interceptors.request.use(
        (config) => {
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error?.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const {newToken, newCookies} = await handleRefreshToken();
                    fillCookies(headers, serializeAccessToken(newToken), newCookies);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return instance(originalRequest);
                }
                catch (error) {
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);
        }
    );

    return {api: instance, headers};
}

async function handleRefreshToken() {
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const tokenService = new TokenService(defaultApi);
    return await tokenService.refreshToken(cookieHeader);
}