"use client";

import {Box, Typography} from "@mui/material";
import useSWR from "swr";
import {getTests} from "@/services/testsService";
import TestPreview from "@/app/dashboard/doctor/tests/components/TestPreview";
import {useState} from "react";
import TestBox from "@/app/dashboard/doctor/tests/layout/TestBox";
import TestBase from "@/schemas/TestBase";

export default function TestsPage() {
    const {data: tests} = useSWR("getTests", getTests);

    const [selectedTest, setSelectedTest] = useState<TestBase>();

    return (
        <Box sx={{
            display: "grid",
            justifyItems: "center",
            maxWidth: 1660,
            maxHeight: "100%",
            mx: "auto",
            flexGrow: 1,
            gap: 3,
            gridTemplateColumns: {xs: "1fr", lg: "1fr 1fr"},
        }}>
            <Box sx={{overflowY: "scroll", display: "flex", px: {lg: 1}, flexDirection: "column", gap: 1}}>
                <Typography variant={"h5"} fontWeight={600} component={"h1"} textAlign={"center"}>Тести</Typography>
                {tests && tests.map(test => (
                    <TestPreview
                        test={test}
                        key={test.id}
                        selected={selectedTest?.id === test.id}
                        onClick={() => setSelectedTest(test)}
                    />
                ))}
            </Box>
            <TestBox
                testPreview={selectedTest}
                onClose={() => setSelectedTest(undefined)}
            />
        </Box>

    );
}