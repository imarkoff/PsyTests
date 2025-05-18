"use client";

import TestResult from "@/schemas/TestResult";
import {Button, Snackbar} from "@mui/material";
import React, {useState} from "react";
import CheckIcon from '@mui/icons-material/Check';
import getExportTestResultUrl from "@/lib/utils/getExportTestResultUrl";

export default function ExportButton({test}: {test: TestResult}) {
    const [submitted, setSubmitted] = useState(false);

    const onClick = () => {
        window.open(getExportTestResultUrl(test.patient_id, test.id));
        setSubmitted(true);
    }

    return (
        <>
            <Button
                loadingPosition={"end"}
                endIcon={submitted ? <CheckIcon /> : undefined}
                onClick={onClick}
            >
                Експортувати у DOCX
            </Button>
            <Snackbar
                open={submitted}
                autoHideDuration={6000}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                message="Файл експортовано"
            />
        </>
    );
}