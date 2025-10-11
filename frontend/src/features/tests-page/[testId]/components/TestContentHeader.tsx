import {Box, Skeleton, Typography} from "@mui/material";
import {AssignTestButton} from "@/components/AssignTestDialog";
import MarksDialog from "@/components/MarksDialog/MarksDialog";
import TestBase from "@/types/models/TestBase";
import { ReactNode } from "react";

interface TestContentHeaderProps {
    test: TestBase;
    header: ReactNode | undefined;
    marks: ReactNode | undefined;
    isLoading: boolean;
}

/**
 * Displays a top header of selected test with additional info
 * @param test
 * @param header - additional content shown below test name
 * @param marks - content of marks dialog
 * @param isLoading - if true, shows skeleton loader
 * @constructor
 */
export default function TestContentHeader({test, header, marks, isLoading}: TestContentHeaderProps) {
    return (
        <Box sx={{px: 2, pt: 1, display: "grid", gap: .5}}>
            <Typography variant={"h5"}>{test.name}</Typography>
            <Typography>{test.description}</Typography>

            {header}

            {isLoading && (
                <Skeleton width={250} variant={"text"} sx={{ fontSize: "1.25rem" }} />
            )}

            <Box sx={{display: "flex", alignItems: "center", gap: 1, py: 1}}>
                <AssignTestButton test={test} />
                {marks && (
                    <MarksDialog test={test}>
                        {marks}
                    </MarksDialog>
                )}
                {isLoading && (
                    <Skeleton width={150} variant={"text"} sx={{ fontSize: "1.25rem", mx: 1 }} />
                )}
            </Box>
        </Box>
    );
}