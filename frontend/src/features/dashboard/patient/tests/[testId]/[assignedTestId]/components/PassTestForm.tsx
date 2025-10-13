"use client";

import {FormProvider, useForm} from "react-hook-form";
import PassTestData from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/schemas/PassTestData";
import testsConfig from "@/features/shared/psy-test-definitions/config";
import {Box, Typography} from "@mui/material";
import {Roles} from "@/types/enums/Role";
import PassTestButton from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/components/PassTestButton";
import {useTestContext} from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/hooks/useTestContext";
import QuestionCardSkeleton from "@/components/QuestionCard/QuestionCardSkeleton";

export default function PassTestForm() {
    const {test, isTestLoading, error, passTest, passed} = useTestContext();
    const methods = useForm<PassTestData>();

    const testLayout = test ? testsConfig[test.type] : null;
    const Content = testLayout?.test.content;

    return (
        <Box component={"form"} onSubmit={methods.handleSubmit(passTest)} sx={{display: "grid", gap: 2}}>
            <FormProvider {...methods}>
                {!!Content && (<Content test={test} role={Roles.patient} disabled={passed} />)}

                {!test && (
                    Array.from({length: 3}).map((_, index) => (
                        <QuestionCardSkeleton key={index} isLoading={isTestLoading} />
                    ))
                )}

                {error && (
                    <Typography sx={{
                        position: "absolute",
                        top: "50%", left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                    }} variant={"h6"} color={"error"}>
                        Виникла помилка при отриманні тесту. <br />
                        Спробуйте ще раз або зверніться до лікаря.
                        <br />
                        {error}
                    </Typography>
                )}

                <PassTestButton />
            </FormProvider>
        </Box>
    );
}