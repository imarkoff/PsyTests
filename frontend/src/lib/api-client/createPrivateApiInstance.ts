"use server";

import {getAccessToken} from "@/lib/auth/tokenManager";
import createApiInstance from "@/lib/api-client/createApiInstance";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import {refreshToken} from "@/lib/controllers/tokenController";

/**
 * Creates an Axios instance for making API requests with authentication.
 */
export default async function createPrivateApiInstance() {
    let accessToken = await getAccessToken();

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
                    const newToken = await withSafeErrorHandling(refreshToken)();
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    accessToken = newToken;
                    return instance(originalRequest);
                }
                catch (error) {
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
}