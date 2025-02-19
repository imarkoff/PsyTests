"use client";

import TestResult from "@/schemas/TestResult";
import {Button, Snackbar} from "@mui/material";
import React, {useState} from "react";
import CheckIcon from '@mui/icons-material/Check';
import {exportTestResult} from "@/services/doctorPatientsTestsService";

export default function ExportButton({test}: {test: TestResult}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [submitted, setSubmitted] = useState(false);

    const onClick = async () => {
        setLoading(true);
        setSubmitted(false);
        setError(undefined);

        try {
            await exportTestResult(test.patient_id, test.id);
            setSubmitted(true);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "Трапилася помилка під час експорту");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Button
                loadingPosition={"end"}
                loading={loading}
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
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                message={error}
            />
        </>
    );
}