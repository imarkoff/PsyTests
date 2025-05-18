"use client";

import {Box} from "@mui/material";
import AssignedTestCard from "@/components/Test/AssignedTestCard";
import TestsLayoutBox from "@/app/dashboard/patient/components/TestsLayoutBox";
import {redirect} from "next/navigation";
import PatientTest from "@/schemas/PatientTest";

export default function TestsLayout({tests}: { tests: PatientTest[] | undefined }) {
    const onStartTest = (testId: string, assignedTestId: string) => {
        redirect(`/dashboard/patient/tests/${testId}/${assignedTestId}`);
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
            </Box>
        </TestsLayoutBox>
    );
}