import {ApiResponse} from "@/lib/api-client/types";
import SafeError from "@/lib/api-client/SafeError";

/**
 * A higher-order function that wraps a controller method to handle errors safely.
 * @param controllerMethod - A function that returns a promise of ApiResponse.
 *
 * @description
 * For example, you call a controller method which returns an ApiResponse.
 * ```ts
 * const response = await getMe();
 * console.log(response.data);
 * // { data { name: "John Doe" }, error: { ... }, success: true }
 * ```
 *
 * Without this wrapper, you need to unwrap the response and check for data and error.
 * With this wrapper, you will get the data directly and throw an error if there is one.
 *
 * ```ts
 * try {
 *    const data = await withSafeErrorHandling(getMe)();
 *    console.log(data); // { name: "John Doe" }
 * }
 * catch (error) {
 *    if (error instanceof SafeError) {
 *       console.error(error.message);  // "Error message"
 *    }
 *    throw error;
 * }
 * ```
 *
 * @example
 * Basic usage with SWR for a method with no parameters
 * ```ts
 * import { getMe } from "@/lib/controllers/userController";
 *
 * const fetchMe = withSafeErrorHandling(getMe);
 * const { data, error } = useSWR("getMe", fetchMe);
 * ```
 *
 * @example
 * Using with SWR for methods that need parameters
 * ```ts
 * import { getUser } from "@/lib/controllers/userController";
 *
 * const useGetUser = (userId: string) => {
 *    const { data, isLoading, error } = useSWR(
 *       "getUser/" + userId,
 *       withSafeErrorHandling(() => getUser(userId))
 *    );
 *    return { data, isLoading, error };
 * }
 * ```
 *
 * @example
 * Direct invocation with parameters and custom error handling
 * ```ts
 * import { getUser } from "@/lib/controllers/userController";
 *
 * const fetchUser = async (userId: string) => {
 *    try {
 *       const data = await withSafeErrorHandling(getUser)(userId);
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
 * ```
 */
export default function withSafeErrorHandling<TData, TParams extends unknown[]>(
    controllerMethod: (...params: TParams) => Promise<ApiResponse<TData>>
) {
    return async function (...params: TParams): Promise<ApiResponse<TData>["data"]> {
        const { data, error } = await controllerMethod(...params);
        if (error) throw SafeError.fromJSON(error.originalError);
        return data;
    }
}