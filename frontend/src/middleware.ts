import { NextRequest } from "next/server";
import {authMatchers, authMiddleware} from "@/lib/middleware/auth";

export async function middleware(request: NextRequest) {
    return authMiddleware(request);
}

export const config = {
    matcher: [...authMatchers]
}