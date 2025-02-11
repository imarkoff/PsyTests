"use client";

import {Box} from "@mui/material";
import useSWR from "swr";
import {getTestsHistory} from "@/services/patientTestsService";
import TestsLayoutBox from "@/app/dashboard/patient/components/TestsLayoutBox";
import TestHistoryShortCard from "@/components/Test/TestHistoryCard/TestHistoryShortCard";

export default function TestsHistoryLayout() {
    const {
        data: testsHistory,
    } = useSWR("getTestsHistory", getTestsHistory);

    return (
        <TestsLayoutBox title={"Історія проходження тестів"}>
            <Box sx={{display: "grid", gridTemplateColumns: {sm: "repeat(auto-fill, minmax(400px, 1fr))"}, gap: 2}}>
                {testsHistory && testsHistory.map(test =>
                    <TestHistoryShortCard test={test} key={test.id} />
                )}
            </Box>
        </TestsLayoutBox>
    );
}