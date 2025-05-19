import {NextRequest, NextResponse} from "next/server";
import {refreshToken} from "@/lib/controllers/tokenController";

export const GET = async (request: NextRequest) => {
    const returnTo = request.nextUrl.searchParams.get("returnTo");

    const { error } = await refreshToken();

    if (error) return new NextResponse(error.statusText, { status: error.status });

    if (returnTo) {
        return NextResponse.redirect(new URL(returnTo ?? "/dashboard", request.url));
    } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
}