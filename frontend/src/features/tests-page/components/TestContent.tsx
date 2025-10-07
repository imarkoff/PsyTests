"use client";

import {ReactNode} from "react";
import {Paper} from "@mui/material";
import TestDrawer from "@/features/tests-page/components/TestDrawer";
import {useTestsContext} from "@/features/tests-page/contexts/TestsContext";
import useWindowSize from "@/hooks/useWindowSize";
import {useParams} from "next/navigation";

export default function TestContent({children}: { children: ReactNode }) {
    const {selectedTest, setSelectedTest} = useTestsContext();
    const {testId} = useParams<{ testId?: string }>();

    const isOpen = !!selectedTest || !!testId;

    const onClose = () => setSelectedTest(null);

    const {width} = useWindowSize();
    const isMobile = width < 1200;

    return (
        <>
            {isMobile && (
                <TestDrawer closeAction={onClose} isOpen={isOpen}>
                    {children}
                </TestDrawer>
            )}
            <Paper sx={{
                overflowY: "scroll",
                borderRadius: 1,
                width: 600,
                maxHeight: "100%",
                position: "relative",
                display: {xs: "none", lg: "flex"},
                flexDirection: "column",
                p: 1,
                gap: 1
            }}>
                {!isMobile && children}
            </Paper>
        </>
    );
}