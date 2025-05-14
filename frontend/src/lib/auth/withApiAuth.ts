import {NextRequest, NextResponse} from "next/server";
import createPrivateApiInstance from "../api-client/createPrivateApiInstance";
import {AxiosError, AxiosInstance} from "axios";

type Handler<T> = (api: AxiosInstance, req: NextRequest) => Promise<T>;

/**
 * withApiAuth is a higher-order function that allows to call authenticated API calls
 * @param handler - A function that takes an AxiosInstance and a NextRequest and returns a Promise of type T
 */
export default function withApiAuth<T>(handler: Handler<T>) {
    return async (req: NextRequest) => {
        const { api, headers } = await createPrivateApiInstance();

        try {
            const data = await handler(api, req);
            return NextResponse.json(data, {headers: headers});
        } catch (err) {
            if (err instanceof AxiosError) {
                return NextResponse.json({
                    error: err.message
                }, {
                    status: err.status || 500,
                });
            }

            throw err;
        }
    };
}
