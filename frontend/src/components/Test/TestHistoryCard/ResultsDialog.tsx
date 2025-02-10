"use client";

import TestResult from "@/schemas/TestResult";
import {Button, Dialog, DialogContent, DialogTitle, Typography} from "@mui/material";
import {useState} from "react";
import TestValues from "@/components/Test/TestValues";
import {dateMed} from "@/utils/formatDate";
import DialogCloseButton from "@/components/DialogCloseButton";
import ResultsTable from "@/components/Test/TestHistoryCard/ResultsTable";

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
                slotProps={{ paper: { elevation: 3 } }}
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
                    <Typography component={"span"} variant={"h6"}>
                        {test.test.name}
                    </Typography>
                    <DialogCloseButton onClose={onClose} />
                </DialogTitle>

                <DialogContent sx={{display: "grid", gap: 2}}>
                    <ResultsTable results={test.results} />
                    <TestValues title={"Дата проходження"}>{dateMed(test.passed_at)}</TestValues>
                </DialogContent>
            </Dialog>
        </>
    );
}