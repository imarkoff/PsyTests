import { NextRequest } from "next/server";
import withApiAuth from "@/lib/auth/withApiAuth";
import { AxiosInstance } from "axios";

type ServiceConstructor<TService> = new (api: AxiosInstance) => TService;

type RouteParams = Promise<Record<string, string>>;

type ServiceMethod<S, R> = (
    service: S,
    request: NextRequest,
    params: RouteParams
) => Promise<R>;

/**
 * Creates an API route handler for Next.js that uses a service class.
 * @param ServiceClass The service class to instantiate
 * @param serviceMethod The service method to call
 *
 * @example
 * A simple operation if you only need to call a single method
 * ```ts
 * import createApiRoute from "@/lib/utils/createApiRoute";
 * import SomeService from "@/lib/services/SomeService";
 *
 * export const GET = createApiRoute(
 *    SomeService,
 *    service => service.getData()
 * )
 * ```
 *
 * @example
 * A more complex operation if you need to call multiple methods
 * ```ts
 * import createApiRoute from "@/lib/utils/createApiRoute";
 * import SomeService from "@/lib/services/SomeService";
 *
 * export const GET = createApiRoute(
 *    SomeService,
 *    async (service, request, params) => {
 *       const { id } = await params;
 *       const searchParams = request.nextUrl.searchParams;
 *       const filter = searchParams.get("filter");
 *       return await service.getData(id, filter);
 *    }
 * )
 * ```
 *
 * @example
 * If you need to use the params but not the request object, you can do it like this:
 * ```ts
 * import createApiRoute from "@/lib/utils/createApiRoute";
 * import SomeService from "@/lib/services/SomeService";
 *
 * export const GET = createApiRoute(
 *    SomeService,
 *    async (service, _, params) => {
 *       const { id } = await params;
 *       return await service.getData(id);
 *    }
 * )
 * ```
 */
export default function createApiRoute<TService, R>(
    ServiceClass: ServiceConstructor<TService>,
    serviceMethod: ServiceMethod<TService, R>
) {
    return withApiAuth(async (
        api,
        request,
        { params }: { params: RouteParams }
    ) => {
        const service = new ServiceClass(api);
        return await serviceMethod(service, request, params);
    });
}