"use client";

import TestsLayout, {TestsLayoutProps} from "@/features/shared/psy-test-catalog/TestsLayout";
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