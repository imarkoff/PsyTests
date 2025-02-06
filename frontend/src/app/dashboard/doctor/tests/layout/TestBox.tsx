import Test from "@/schemas/Test";
import {Paper} from "@mui/material";
import TestContent from "@/app/dashboard/doctor/tests/layout/TestContent";
import TestDrawer from "@/app/dashboard/doctor/tests/components/TestDrawer";
import {useEffect, useRef} from "react";

export default function TestBox({test, onClose}: {test?: Test, onClose: () => void}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollTo({top: 0});
    }, [test]);

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
                <TestContent test={test} />
            </Paper>
            <TestDrawer closeAction={onClose} isOpen={!!test}>
                <TestContent test={test} />
            </TestDrawer>
        </>
    );
}