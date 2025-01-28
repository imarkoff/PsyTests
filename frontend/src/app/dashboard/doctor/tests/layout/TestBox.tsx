import Test from "@/schemas/Test";
import {Paper} from "@mui/material";
import TestContent from "@/app/dashboard/doctor/tests/layout/TestContent";
import TestDrawer from "@/app/dashboard/doctor/tests/components/TestDrawer";

export default function TestBox({test, onClose}: {test?: Test, onClose: () => void}) {
    return (
        <>
            <Paper sx={{
                overflow: "scroll",
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