"use client";

import TestsLayout, {TestsLayoutProps} from "@/features/tests-page/TestsLayout";
import routeConfig from "@/config/routeConfig";

type AdminTestsProps = Omit<TestsLayoutProps, 'testRoute'>;

export default function AdminTests(props: AdminTestsProps) {
    return (
        <TestsLayout
            {...props}
            testRoute={routeConfig.dashboard.admin.tests.testId.route}
        />
    );
}