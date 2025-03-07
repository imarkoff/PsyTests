"use client";

import {Box, Typography} from "@mui/material";
import TestPreview from "@/app/dashboard/doctor/tests/components/TestPreview";
import {useTestsContext} from "@/app/dashboard/doctor/tests/context/TestsContext";
import {useParams} from "next/navigation";
import TestBase from "@/schemas/TestBase";

export default function TestsLayout() {
    const { tests, selectedTest, setSelectedTest } = useTestsContext();
    const { testId } = useParams<{ testId?: string }>();

    const isSelected = (test: TestBase) =>
        test.id === testId || test.id === selectedTest?.id;

    return (
        <Box sx={{
            overflowY: "scroll",
            display: "flex",
            maxWidth: 550,
            px: {lg: 1},
            flexDirection: "column",
            gap: 1,
        }}>
            <Typography variant={"h5"} fontWeight={600} component={"h1"} textAlign={"center"}>Тести</Typography>
            {tests?.map(test => (
                <TestPreview
                    test={test}
                    key={test.id}
                    selected={isSelected(test)}
                    onClick={() => setSelectedTest(test)}
                />
            ))}
        </Box>
    );
}