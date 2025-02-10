"use client";

import {Box} from "@mui/material";
import useSWR from "swr";
import {getTestsHistory} from "@/services/patientTestsService";
import TestHistoryCard from "@/components/Test/TestHistoryCard/TestHistoryCard";
import TestsLayoutBox from "@/app/dashboard/patient/components/TestsLayoutBox";

export default function TestsHistoryLayout() {
    const {
        data: testsHistory,
    } = useSWR(getTestsHistory.name, getTestsHistory);

    return (
        <TestsLayoutBox title={"Історія проходження тестів"}>
            <Box sx={{display: "grid", gridTemplateColumns: {sm: "repeat(auto-fill, minmax(400px, 1fr))"}, gap: 2}}>
                {testsHistory?.map(test => <TestHistoryCard test={test} key={test.id} />)}
            </Box>
        </TestsLayoutBox>
    );
}