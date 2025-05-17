import {ApiResponse} from "@/lib/api-client/types";
import SafeError from "@/lib/api-client/SafeError";

/**
 * A higher-order function that wraps a controller method to handle errors safely.
 * @param controllerMethod - A function that returns a promise of ApiResponse.
 *
 * @example
 * ```ts
 * import { getMe } from "@/lib/controllers/userController";
 *
 * const fetchMe = withSafeErrorHandling(getMe);
 * const { data, error } = useSWR("getMe", fetchMe);
 * ```
 *
 * @example
 * ```ts
 * import { getUser } from "@/lib/controllers/userController";
 *
 * const fetchUser = async (userId: string) => {
 *    try {
 *       const data = await withSafeErrorHandling(() => getUser(userId));
 *       return data;
 *    }
 *    catch (error) {
 *       if (error instanceof SafeError) {
 *          // Handle the error
 *          console.error(error.message);
 *       }
 *       throw error;
 *    }
 * }
 */
export default function withSafeErrorHandling<TData>(
    controllerMethod: () => Promise<ApiResponse<TData>>
) {
    return async function (): Promise<ApiResponse<TData>["data"]> {
        const { data, error } = await controllerMethod();
        if (error) throw SafeError.fromJSON(error.originalError);
        return data;
    }
}