import {ISafeError} from "@/lib/api-client/SafeError";

/**
 * Defines the structure of the API response
 * for a Server Actions request.
 */
export interface ApiResponse<T> {
    data: T | undefined;
    error?: {
        status: number;
        statusText: string;
        originalError: ISafeError;
    };
    success: boolean;
}