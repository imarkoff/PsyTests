import LeaveTestButton from "./LeaveTestButton";
import {Box} from "@mui/material";
import PsyTestViewer from "@/features/shared/psy-test-viewer";

export default function PassTestHeader() {
    return (
        <Box sx={{paddingX: 2, display: "flex", flexDirection: "column", gap: 1, alignItems: "start"}}>
            <LeaveTestButton />
            <PsyTestViewer.Title/>
            <PsyTestViewer.HeaderDetails/>
        </Box>
    );
}