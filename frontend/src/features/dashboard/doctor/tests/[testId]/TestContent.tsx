"use client";

import {useTestsContext} from "@/features/dashboard/doctor/tests/contexts/TestsContext";
import useTest from "@/features/dashboard/doctor/tests/[testId]/hooks/useTest";
import testsConfig from "@/features/tests/config";
import {Roles} from "@/schemas/Role";
import TestContentHeader from "@/features/dashboard/doctor/tests/[testId]/components/TestContentHeader";
import QuestionCardSkeleton from "@/components/QuestionCard/QuestionCardSkeleton";

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
                    isLoading={isLoading}
                />
            )}

            {Content && <Content test={test} role={Roles.doctor} disabled />}

            {isLoading && (
                Array.from({ length: 3 }).map((_, index) => (
                    <QuestionCardSkeleton key={index} />
                ))
            )}
        </>
    );
}