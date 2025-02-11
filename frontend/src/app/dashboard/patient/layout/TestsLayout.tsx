"use client";

import {Box} from "@mui/material";
import useSWR from "swr";
import {getAssignedTests} from "@/services/patientTestsService";
import AssignedTestCard from "@/components/Test/AssignedTestCard";
import TestsLayoutBox from "@/app/dashboard/patient/components/TestsLayoutBox";
import {redirect} from "next/navigation";

export default function TestsLayout() {
    const {
        data: tests
    } = useSWR("getAssignedTests", getAssignedTests);

    const onStartTest = (testId: string) => {
        redirect(`/dashboard/patient/tests/${testId}`);
    }

    return (
        <TestsLayoutBox title={"Доступні тести"}>
            <Box sx={{display: "grid", gridTemplateColumns: {sm: "repeat(auto-fill, minmax(400px, 1fr))"}, gap: 2}}>
                {tests?.map(test =>
                    <AssignedTestCard
                        key={test.id}
                        test={test}
                        onStart={() => onStartTest(test.id)}
                    />)}
            </Box>
        </TestsLayoutBox>
    );
}