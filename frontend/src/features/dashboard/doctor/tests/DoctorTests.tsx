"use client";

import TestsLayout, {TestsLayoutProps} from "@/features/tests-page/TestsLayout";
import routeConfig from "@/config/routeConfig";

type DoctorTestsProps = Omit<TestsLayoutProps, 'testRoute'>;

export default function DoctorTests(props: DoctorTestsProps) {
    return (
        <TestsLayout
            {...props}
            testRoute={routeConfig.dashboard.doctor.tests.testId.route}
        />
    );
}