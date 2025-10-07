const routeConfig = {
    dashboard: {
        route: "/dashboard",
        admin: {
            route: "/dashboard/admin",
            tests: {
                route: "/dashboard/admin/tests",
                testId: {
                    route: (testId: string) => `/dashboard/admin/tests/${testId}`
                },
            }
        },
        doctor: {
            route: "/dashboard/doctor",
            tests: {
                route: "/dashboard/doctor/tests",
                testId: {
                    route: (testId: string) => `/dashboard/doctor/tests/${testId}`
                }
            }
        }
    }
};

export default routeConfig;