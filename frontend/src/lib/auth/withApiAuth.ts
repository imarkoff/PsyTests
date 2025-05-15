import {NextRequest, NextResponse} from "next/server";
import createPrivateApiInstance from "../api-client/createPrivateApiInstance";
import {AxiosError, AxiosInstance} from "axios";

type HandlerParams<TParams = object> = { params: Promise<TParams> }
type Handler<T, TParams> = (api: AxiosInstance, req: NextRequest, context: HandlerParams<TParams>) => Promise<T>;

/**
 * withApiAuth is a higher-order function that allows to call authenticated API calls.
 * Authomatically handles errors and token refresh
 *
 * @param handler - A function that takes an AxiosInstance and a NextRequest and returns a Promise of type T
 *
 * @example Getting data without params
 * ```ts
 * import withApiAuth from "@/app/lib/auth/withApiAuth";
 * import SomeService from "@/app/lib/services/SomeService";
 *
 * export const GET = withApiAuth(async (api) => {
 *     const someService = new SomeService(api);
 *     return await someService.getData();
 * })
 * ```
 *
 * @example Getting data with params
 * ```ts
 * import withApiAuth from "@/app/lib/auth/withApiAuth";
 * import SomeService from "@/app/lib/services/SomeService";
 *
 * export const GET = withApiAuth(async (
 *    api,
 *    _,  // that's the NextRequest - if you don't need it, just use `_`
 *    { params }: { params: Promise<{id: string}> }
 * ) => {
 *    const { id } = await params;
 *    const someService = new SomeService(api);
 *    return await someService.getData(id);
 * })
 * ```
 *
 * @example Using searchParams and return a NextResponse if something goes wrong
 * ```ts
 * import withApiAuth from "@/app/lib/auth/withApiAuth";
 * import {NextResponse} from "next/server";
 *
 * export const GET = withApiAuth(async (api, request) => {
 *    const searchParams = request.nextUrl.searchParams;
 *    const search = searchParams.get("search");
 *
 *    if (!search) {
 *       return NextResponse.json({ error: "Search param is required" }, { status: 400 });
 *    }
 * }
 * ```
 */
export default function withApiAuth<T, TParams>(handler: Handler<T, TParams>) {
    return async (req: NextRequest, context: HandlerParams<TParams>) => {
        const { api, headers } = await createPrivateApiInstance();

        try {
            const data = await handler(api, req, context);

            if (data instanceof NextResponse) return data;

            return NextResponse.json(data, {headers: headers});
        } catch (err) {
            if (err instanceof AxiosError) {
                return NextResponse.json({
                    error: err.response?.data || err.message,
                }, {
                    status: err.status || 500,
                });
            }

            throw err;
        }
    };
}
