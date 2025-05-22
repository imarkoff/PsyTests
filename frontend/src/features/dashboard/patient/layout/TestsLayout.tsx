"use client";

import {Box} from "@mui/material";
import AssignedTestCard from "@/components/AssignedTestCard/AssignedTestCard";
import TestsLayoutBox, { TestsLayoutError } from "@/features/dashboard/patient/components/TestsLayoutBox";
import {useRouter} from "next/navigation";
import PatientTest from "@/schemas/PatientTest";
import {ApiResponse} from "@/lib/api-client/types";

export default function TestsLayout(
    {assignedTestsResponse}: { assignedTestsResponse: ApiResponse<PatientTest[]> }
) {
    const { data: tests, error } = assignedTestsResponse;

    const router = useRouter();

    const onStartTest = (testId: string, assignedTestId: string) => {
        router.push(`/dashboard/patient/tests/${testId}/${assignedTestId}`);
    }

    return (
        <TestsLayoutBox title={"Доступні тести"}>
            <Box sx={{display: "grid", gridTemplateColumns: {sm: "repeat(auto-fill, minmax(400px, 1fr))"}, gap: 2}}>
                {tests?.map(test =>
                    <AssignedTestCard
                        key={test.id}
                        test={test}
                        onStart={() => onStartTest(test.test.id, test.id)}
                    />)}
                {error && (
                    <TestsLayoutError error={error} friendlyMessage={`
                        Сталася помилка при завантаженні тестів.
                        Спробуйте ще раз або зверніться до лікаря.
                    `} />
                )}
            </Box>
        </TestsLayoutBox>
    );
}