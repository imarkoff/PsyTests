import {Paper} from "@mui/material";
import TestContent from "@/app/dashboard/doctor/tests/layout/TestContent";
import TestDrawer from "@/app/dashboard/doctor/tests/components/TestDrawer";
import {useEffect, useRef} from "react";
import TestBase from "@/schemas/TestBase";
import useSWR from "swr";
import {getTest} from "@/services/testsService";

export default function TestBox({testPreview, onClose}: {testPreview?: TestBase, onClose: () => void}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const {
        data: test
    } = useSWR(
        testPreview ? `getTest/${testPreview?.id}` : null,
        () => testPreview ? getTest(testPreview.id) : null,
        {revalidateOnFocus: false}
    );

    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollTo({top: 0});
    }, [testPreview]);

    return (
        <>
            <Paper ref={scrollRef} sx={{
                overflowY: "scroll",
                borderRadius: 5,
                width: {xs: "100%", md: 600},
                maxHeight: "100%",
                position: "relative",
                display: {xs: "none", lg: "flex"},
                flexDirection: "column",
                p: 1,
                gap: 1
            }}>
                <TestContent test={test ?? testPreview} />
            </Paper>
            <TestDrawer closeAction={onClose} isOpen={!!testPreview}>
                <TestContent test={test ?? testPreview} />
            </TestDrawer>
        </>
    );
}