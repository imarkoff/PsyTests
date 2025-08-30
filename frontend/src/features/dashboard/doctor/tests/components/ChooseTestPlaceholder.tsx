import {ReactNode} from "react";
import TestsProvider from "@/features/dashboard/doctor/tests/contexts/TestsProvider";
import {Box} from "@mui/material";
import TestContent from "@/features/dashboard/doctor/tests/components/TestContent";
import TestBase from "@/types/models/TestBase";
import { ApiResponse } from "@/lib/api-client/types";
import TestPreviewList from "@/features/dashboard/doctor/tests/components/TestPreviewList";

interface TestsLayoutProps {
    testsResponse: ApiResponse<TestBase[]>;
    children: ReactNode;
}

export default function ChooseTestPlaceholder({testsResponse, children}: TestsLayoutProps) {
    return (
        <TestsProvider tests={testsResponse.data ?? []}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-evenly",
                maxWidth: 1660,
                alignSelf: "center",
                maxHeight: "100%",
                flexGrow: 1,
                gap: 5,
            }}>
                <TestPreviewList />
                <TestContent>{children}</TestContent>
            </Box>
        </TestsProvider>
    );
}