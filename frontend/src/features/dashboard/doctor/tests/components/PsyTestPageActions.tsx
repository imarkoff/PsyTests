"use client";

import {Box} from "@mui/material";
import {AssignTestButton} from "@/components/AssignTestDialog";
import PsyTestViewer, {usePsyTestContext} from "@/features/shared/psy-test-viewer";

export default function PsyTestPageActions() {
    const { test } = usePsyTestContext();

    return (
        <Box sx={{display: "flex", alignItems: "center", gap: 1, py: 1}}>
            {test && <AssignTestButton test={test}/>}
            <PsyTestViewer.MarksDialog/>
        </Box>
    );
}