"use client";

import {Box} from "@mui/material";
import useSWR from "swr";
import {getTests} from "@/services/patientTestsService";
import AvailableTestCard from "@/app/dashboard/patient/components/AvailableTestCard";
import TestsLayoutBox from "@/app/dashboard/patient/components/TestsLayoutBox";

export default function TestsLayout() {
    const {
        data: tests
    } = useSWR(getTests.name, getTests);

    return (
        <TestsLayoutBox title={"Доступні тести"}>
            <Box sx={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 2}}>
                {tests?.map(test => <AvailableTestCard key={test.id} test={test} />)}
            </Box>
        </TestsLayoutBox>
    );
}