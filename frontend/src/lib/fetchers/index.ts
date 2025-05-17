import {AxiosInstance} from "axios";
import createApiInstance from "@/lib/api-client/createApiInstance";
import createPrivateApiInstance from "@/lib/api-client/createPrivateApiInstance";
import {ApiResponse} from "@/lib/api-client/types";
import errorHandler from "@/lib/api-client/errorHandler";

type ServiceConstructor<TService> = new (api: AxiosInstance) => TService;

/**
 * Fetches data from a protected endpoint using a service method.
 * Automatically catches errors and returns a standardized response.
 * @param Service - The service class to use for the request.
 * @param serviceMethod - The method of the service class to call.
 *
 * @example
 * ```ts
 * import SomeService from "@/lib/services/SomeService";
 * import {fetchProtected} from "@/lib/fetchers";
 *
 * const response = await fetchProtected(
 *    SomeService,
 *    async (service) => {
 *       const data = await service.getData();
 *       return data;
 *    }
 * );
 * ```
 */
export async function fetchProtected<TService, TResponse>(
    Service: ServiceConstructor<TService>,
    serviceMethod: (service: TService) => Promise<TResponse>
): Promise<ApiResponse<TResponse>> {
    return errorHandler(async () => {
        const api = await createPrivateApiInstance();
        const service = new Service(api);
        return serviceMethod(service);
    });
}

/**
 * Fetches data from a public endpoint using a service method.
 * Automatically catches errors and returns a standardized response.
 * @param Service - The service class to use for the request.
 * @param serviceMethod - The method of the service class to call.
 *
 * @example
 * ```ts
 * import SomeService from "@/lib/services/SomeService";
 * import {fetchPublic} from "@/lib/fetchers";
 *
 * const response = await fetchPublic(
 *   SomeService,
 *   service => service.getData()
 * );
 * ```
 */
export function fetchPublic<TService, TResponse>(
    Service: ServiceConstructor<TService>,
    serviceMethod: (service: TService) => Promise<TResponse>
): Promise<ApiResponse<TResponse>> {
    const api = createApiInstance();
    const service = new Service(api);

    return errorHandler(() => serviceMethod(service));
}