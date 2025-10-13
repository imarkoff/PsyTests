"use client";

import {Box} from "@mui/material";
import {Roles} from "@/types/enums/Role";
import PsyTestViewer from "@/features/shared/psy-test-viewer";
import PassTestProvider from "./contexts/PassTestProvider";
import PassTestHeader from "./components/PassTestHeader";
import PassTestForm from "./components/PassTestForm";

interface PassTestPageProps {
    testId: string;
    assignedTestId: string;
}

export default function PassTestPage(
    {testId, assignedTestId}: PassTestPageProps
) {
    return (
        <PsyTestViewer.Provider testId={testId} userRole={Roles.patient}>
            <PassTestProvider assignedTestId={assignedTestId}>
                <Box sx={passTestPageStyles}>
                    <PassTestHeader />
                    <PassTestForm />
                </Box>
            </PassTestProvider>
        </PsyTestViewer.Provider>
    );
}

const passTestPageStyles = {
    maxWidth: 600,
    width: "100%",
    marginX: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 1
}