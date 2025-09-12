import {ISafeError} from "@/lib/api-client/SafeError";

/**
 * Defines the structure of the API response
 * for a Server Actions request.
 */
export interface ApiResponse<T> {
    data: T | undefined;
    error?: ApiResponseError;
    success: boolean;
}

export interface ApiResponseError {
    status: number;
    statusText: string;
    originalError: ISafeError;
}