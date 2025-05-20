import {Box, Typography} from "@mui/material";
import AssignTestButton from "@/features/dashboard/doctor/tests/components/AssignTestDialog/AssignTestButton";
import MarksDialog from "@/components/Test/Marks/MarksDialog";
import TestBase from "@/schemas/TestBase";
import { ReactNode } from "react";

interface TestContentHeaderProps {
    test: TestBase;
    header: ReactNode | undefined;
    marks: ReactNode | undefined;
}

/**
 * Displays a top header of selected test with additional info
 * @param test
 * @param header - additional content shown below test name
 * @param marks - content of marks dialog
 * @constructor
 */
export default function TestContentHeader({test, header, marks}: TestContentHeaderProps) {
    return (
        <Box sx={{px: 2, pt: 1, display: "grid", gap: .5}}>
            <Typography variant={"h5"}>{test.name}</Typography>
            <Typography>{test.description}</Typography>

            {header}

            <Box sx={{display: "flex", alignItems: "center", gap: 1, py: 1}}>
                <AssignTestButton testId={test.id} />
                {marks && (
                    <MarksDialog test={test}>
                        {marks}
                    </MarksDialog>
                )}
            </Box>
        </Box>
    );
}