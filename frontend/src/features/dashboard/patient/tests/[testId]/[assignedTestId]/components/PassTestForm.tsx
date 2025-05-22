"use client";

import {FormProvider, useForm} from "react-hook-form";
import PassTestData from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/schemas/PassTestData";
import testsConfig from "@/features/tests/config";
import {Box} from "@mui/material";
import {Roles} from "@/schemas/Role";
import PassTestButton from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/components/PassTestButton";
import {useTestContext} from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/hooks/useTestContext";
import QuestionCardSkeleton from "@/components/QuestionCard/QuestionCardSkeleton";

export default function PassTestForm() {
    const {test, isTestLoading, passTest, passed} = useTestContext();
    const methods = useForm<PassTestData>();

    const testLayout = test ? testsConfig[test.type] : null;
    const Content = testLayout?.test.content;

    return (
        <Box component={"form"} onSubmit={methods.handleSubmit(passTest)} sx={{display: "grid", gap: 2}}>
            <FormProvider {...methods}>
                {isTestLoading ? (
                    Array.from({length: 5}).map((_, index) => (
                        <QuestionCardSkeleton key={index} />
                    ))
                ) : (
                    Content && <Content test={test} role={Roles.patient} disabled={passed} />
                )}
                <PassTestButton />
            </FormProvider>
        </Box>
    );
}