import TestProvider from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/contexts/TestProvider";
import PassTestHeader from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/components/PassTestHeader";
import PassTestForm from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/components/PassTestForm";
import {Box} from "@mui/material";

interface PassTestPageProps {
    testId: string;
    assignedTestId: string;
}

export default function PassTestPage({testId, assignedTestId}: PassTestPageProps) {
    return (
        <TestProvider testId={testId} assignedTestId={assignedTestId}>
            <Box sx={passTestPageStyles}>
                <PassTestHeader />
                <PassTestForm />
            </Box>
        </TestProvider>
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