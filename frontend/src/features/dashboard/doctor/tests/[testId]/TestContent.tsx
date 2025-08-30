"use client";

import {useTestsContext} from "@/features/dashboard/doctor/tests/contexts/TestsContext";
import useTest from "@/features/dashboard/doctor/tests/[testId]/hooks/useTest";
import testsConfig from "@/features/tests/config";
import {Roles} from "@/types/enums/Role";
import TestContentHeader from "@/features/dashboard/doctor/tests/[testId]/components/TestContentHeader";
import QuestionCardSkeleton from "@/components/QuestionCard/QuestionCardSkeleton";
import { Typography } from "@mui/material";

export default function TestContent({testId}: { testId: string }) {
    const { selectedTest } = useTestsContext();
    const { test, isLoading, error } = useTest(testId);
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

            {error && (
                <Typography variant="h6" color={"error"} sx={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center"
                }}>
                    Виникла помилка при завантаженні тесту. Спробуйте ще раз.
                    <br />
                    {error.message}
                </Typography>
            )}
        </>
    );
}