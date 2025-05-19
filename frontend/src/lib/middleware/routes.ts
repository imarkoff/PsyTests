export const publicRoutes = ['/login', '/register', '/forgot-password'];
export const protectedRoutes = ['/dashboard'];

export const checkIsPublicRoute = (pathname: string) =>
    publicRoutes.some(route => pathname.startsWith(route));

export const checkIsProtectedRoute = (pathname: string) =>
    protectedRoutes.some(route => pathname.startsWith(route));