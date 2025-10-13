"use client";

import {Roles} from "@/types/enums/Role";
import {Box} from "@mui/material";
import PsyTestViewer from "@/features/shared/psy-test-viewer";
import PsyTestPageActions from "./components/PsyTestPageActions";

export default function DoctorTestPage(
    {testId}: { testId: string }
) {
    return (
        <PsyTestViewer.Provider
            testId={testId}
            userRole={Roles.doctor}
        >
            <Box sx={{px: 2, pt: 1, display: "grid", gap: .5}}>
                <PsyTestViewer.Title/>
                <PsyTestViewer.HeaderDetails/>
                <PsyTestPageActions/>
            </Box>
            <PsyTestViewer.ErrorAlert suggestionMessage={
                "Якщо після перезавантаження проблема залишається, зверніться до адміністратора."
            }/>
            <PsyTestViewer.Content/>
        </PsyTestViewer.Provider>
    );
}