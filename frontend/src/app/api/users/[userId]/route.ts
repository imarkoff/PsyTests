import {NextRequest, NextResponse} from "next/server";
import UserService from "@/lib/services/UserService";
import {defaultApi} from "@/lib/api-client/createApiInstance";
import {AxiosError} from "axios";

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const {userId} = await params;
    const userService = new UserService(defaultApi);

    try {
        const data = await userService.getUser(userId);
        return NextResponse.json(data);
    }
    catch (error) {
        if (error instanceof AxiosError) {
            return NextResponse.json({
                error: error.message
            }, {
                status: error.status,
            });
        }
        throw error;
    }
}