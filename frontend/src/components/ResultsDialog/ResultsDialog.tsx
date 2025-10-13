"use client";

import TestResult from "@/types/models/TestResult";
import {Button, Dialog} from "@mui/material";
import {useState} from "react";
import ResultsTitle from "@/components/ResultsDialog/components/ResultsTitle";
import ResultsContent from "@/components/ResultsDialog/components/ResultsContent";

/**
 * Dialog for displaying test results
 * @param test - test result
 * @constructor
 */
export default function ResultsDialog({test}: {test: TestResult}) {
    const [open, setOpen] = useState(false);

    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);

    return (
        <>
            <Button onClick={onOpen}>Показати результати</Button>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth={"md"}
                fullWidth
                slotProps={{ paper: { elevation: 3, sx: { m: 1, width: "100%" } } }}
                scroll={"paper"}
            >
                <ResultsTitle test={test.test} onClose={onClose} />
                <ResultsContent testResult={test} />
            </Dialog>
        </>
    );
}