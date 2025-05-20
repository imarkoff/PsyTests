"use client";

import {useTestsContext} from "@/features/dashboard/doctor/tests/contexts/TestsContext";
import useTest from "@/features/dashboard/doctor/tests/[testId]/hooks/useTest";
import testsConfig from "@/features/tests/config";
import {Roles} from "@/schemas/Role";
import CenteredSpinner from "@/features/dashboard/doctor/tests/[testId]/components/CenteredSpinner";
import TestContentHeader from "@/features/dashboard/doctor/tests/[testId]/components/TestContentHeader";

export default function TestContent({testId}: { testId: string }) {
    const { selectedTest } = useTestsContext();
    const { test, isLoading } = useTest(testId);
    const testBase = selectedTest || test;

    const testLayout = test ? testsConfig[test.type] : null;
    const { header: Header, content: Content, marks: Marks } = testLayout?.test || {};

    return (
        <>
            {testBase && (
                <TestContentHeader
                    test={testBase}
                    header={Header && <Header test={test} role={Roles.doctor} disabled />}
                    marks={Marks && <Marks test={test} role={Roles.doctor} />}
                />
            )}

            {Content && <Content test={test} role={Roles.doctor} disabled />}

            {isLoading && <CenteredSpinner />}
        </>
    );
}