"use client";

import PsyTestViewer from "@/features/shared/psy-test-viewer";
import {Roles} from "@/types/enums/Role";
import {Box} from "@mui/material";

export default function AdminTestPage(
    {testId}: { testId: string }
) {
    return (
        <PsyTestViewer.Provider
            testId={testId}
            userRole={Roles.admin}
        >
            <Box sx={{px: 2, pt: 1, display: "grid", gap: .5}}>
                <PsyTestViewer.Title/>
                <PsyTestViewer.HeaderDetails/>
                <PsyTestViewer.MarksDialog/>
            </Box>
            <PsyTestViewer.ErrorAlert/>
            <PsyTestViewer.Content/>
        </PsyTestViewer.Provider>
    );
}