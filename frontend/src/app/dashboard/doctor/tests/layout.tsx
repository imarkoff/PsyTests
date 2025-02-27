import {Box} from "@mui/material";
import {ReactNode} from "react";
import TestsProvider from "@/app/dashboard/doctor/tests/context/TestsProvider";
import TestsLayout from "@/app/dashboard/doctor/tests/layout/TestsLayout";
import TestContent from "@/app/dashboard/doctor/tests/layout/TestContent";

export default function TestsPage({children}: { children: ReactNode }) {
    return (
        <TestsProvider>
            <Box sx={{
                display: "flex",
                justifyContent: "space-evenly",
                maxWidth: 1660,
                alignSelf: "center",
                maxHeight: "100%",
                flexGrow: 1,
                gap: 5,
            }}>
                <TestsLayout />
                <TestContent>{children}</TestContent>
            </Box>
        </TestsProvider>
    );
}