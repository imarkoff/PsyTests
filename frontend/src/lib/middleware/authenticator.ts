import {NextRequest, NextResponse} from "next/server";
import {Role, Roles} from "@/schemas/Role";
import decodeToken from "@/lib/auth/decodeToken";
import {getAccessTokenFromRequest} from "@/lib/auth/tokenManager";
import {checkIsProtectedRoute} from "@/lib/middleware/routes";

/** Middleware to handle role-based routing and access control. */
export async function authenticatorMiddleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const isProtectedRoute = checkIsProtectedRoute(pathname);

    const role = await getRoleFromRequest(request);

    if (role === null) {
        return isProtectedRoute
            ? NextResponse.redirect(new URL('/login', request.url))
            : NextResponse.next();
    }

    const roleBasedRedirect = handleRoleBasedRouting(pathname, role, request.url);
    if (roleBasedRedirect) return roleBasedRedirect;

    const roleBasedAccess = checkRoleBasedAccess(pathname, role, request.url);
    if (roleBasedAccess) return roleBasedAccess;

    return NextResponse.next();
}

const getRoleFromRequest = async (request: NextRequest) => {
    try {
        const accessToken = getAccessTokenFromRequest(request) ?? "";

        const { role } = await decodeToken(accessToken);
        return role;
    } catch (error) {
        console.error("Token decode error:", error instanceof Error ? error.message : error);
        return null;
    }
}

const handleRoleBasedRouting = (
    pathname: string, role: Role, url: string
) => {
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
        if (role === Roles.patient) return NextResponse.redirect(new URL('/dashboard/patient', url));
        if (role === Roles.doctor) return NextResponse.redirect(new URL('/dashboard/doctor', url));
        if (role === Roles.admin) return NextResponse.redirect(new URL('/dashboard/admin', url))
    }
    return null;
}

const checkRoleBasedAccess = (
    pathname: string, role: Role, url: string
) => {
    const patientRoutePattern = /^\/dashboard\/patient(?:\/.*)?$/;
    const doctorRoutePattern = /^\/dashboard\/doctor(?:\/.*)?$/;
    const adminRoutePattern = /^\/dashboard\/admin(?:\/.*)?$/;

    const noAccessToPatientRoute = patientRoutePattern.test(pathname) && role !== Roles.patient;
    const noAccessToDoctorRoute = doctorRoutePattern.test(pathname) && role !== Roles.doctor;
    const noAccessToAdminRoute = adminRoutePattern.test(pathname) && role !== Roles.admin;

    if (noAccessToDoctorRoute || noAccessToPatientRoute || noAccessToAdminRoute) {
        return NextResponse.redirect(new URL('/dashboard', url));
    }
    
    return null;
}