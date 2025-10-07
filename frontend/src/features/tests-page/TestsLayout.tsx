import {ReactNode} from "react";
import TestsProvider from "@/features/tests-page/contexts/TestsProvider";
import {Box} from "@mui/material";
import TestContent from "@/features/tests-page/components/TestContent";
import TestBase from "@/types/models/TestBase";
import { ApiResponse } from "@/lib/api-client/types";
import TestPreviewList from "@/features/tests-page/components/TestPreviewList";

export interface TestsLayoutProps {
    testsResponse: ApiResponse<TestBase[]>;
    testRoute: (testId: string) => string;
    children: ReactNode;
}

export default function TestsLayout(
    {testsResponse, testRoute, children}: TestsLayoutProps) {
    return (
        <TestsProvider
            tests={testsResponse.data ?? []}
            testRoute={testRoute}
        >
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