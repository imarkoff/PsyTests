import {NextResponse} from "next/server";
import {refreshToken} from "@/lib/controllers/tokenController";

export const POST = async () => {
    const { error } = await refreshToken();
    if (error) return new NextResponse(error.statusText, { status: error.status });
    return new NextResponse("Token refreshed successfully", { status: 200 });
}