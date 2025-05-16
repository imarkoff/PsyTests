import {AxiosInstance} from "axios";
import createApiInstance from "@/lib/api-client/createApiInstance";
import createPrivateApiInstance from "@/lib/api-client/createPrivateApiInstance";

type ServiceConstructor<TService> = new (api: AxiosInstance) => TService;

export async function fetchProtected<TService, TResponse>(
    Service: ServiceConstructor<TService>,
    serviceMethod: (service: TService) => Promise<TResponse>
): Promise<TResponse> {
    const api = await createPrivateApiInstance();
    const service = new Service(api);
    return serviceMethod(service);
}

export function fetchPublic<TService, TResponse>(
    Service: ServiceConstructor<TService>,
    serviceMethod: (service: TService) => Promise<TResponse>
): Promise<TResponse> {
    const api = createApiInstance();
    const service = new Service(api);
    return serviceMethod(service);
}