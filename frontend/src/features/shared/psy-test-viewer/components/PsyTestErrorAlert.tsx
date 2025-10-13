"use client";

import {ReactNode} from "react";
import {Alert, AlertTitle} from "@mui/material";
import usePsyTestContext from "../hooks/usePsyTestContext";

interface PsyTestErrorAlertProps {
    suggestionMessage?: ReactNode
}

export default function PsyTestErrorAlert(
    {suggestionMessage}: PsyTestErrorAlertProps
) {
    const {error} = usePsyTestContext();

    return error && (
        <Alert severity="error">
            <AlertTitle>
                Сталася помилка при завантаженні тесту.
            </AlertTitle>
            {error.statusText}
            <br/>
            {suggestionMessage}
        </Alert>
    );
}