import {ApiResponse} from "@/lib/api-client/types";
import {AxiosError} from "axios";
import {ISafeError} from "@/lib/api-client/SafeError";

/**
 * Error handler for API calls
 * @param action - The action to be performed
 *
 * @example
 * ```ts
 * const { data, error, success } = await errorHandler(() => api.get("/endpoint"));
 *
 * if (success) {
 *   console.log(data);
 * } else {
 *   console.error(error);
 * }
 * ```
 */
export default async function errorHandler<T>(
    action: () => Promise<T>,
): Promise<ApiResponse<T>> {
    try {
        const result = await action();
        return {
            data: result,
            success: true,
        }
    } catch (error) {
        const safeError: ISafeError = {
            message: error instanceof Error ? error.message : "Unknown error",
            name: error instanceof Error ? error.name : "Error",
            status: error instanceof AxiosError ? (error.response?.status || 500) : 500,
        };

        return {
            data: error instanceof AxiosError ? error.response?.data : null,
            success: false,
            error: {
                status: error instanceof AxiosError ? (error.status || 500) : 500,
                statusText: error instanceof Error ? error.message : "Server error",
                originalError: safeError
            }
        };
    }
}