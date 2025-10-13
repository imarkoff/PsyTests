"use client";

import {PropsWithChildren} from "react";
import {Dialog} from "@mui/material";
import {DIALOG_TITLE_ID} from "../constants";
import useTestAssignmentContext from "../hooks/contexts/useTestAssignmentContext";

interface AssignDialogProps extends PropsWithChildren {
    open: boolean;
}

export default function AssignDialog({open, children}: AssignDialogProps) {
    const { handleClose } = useTestAssignmentContext();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby={DIALOG_TITLE_ID}
            maxWidth={"sm"}
            fullWidth
            scroll={"paper"}
            slotProps={{ paper: { elevation: 1, sx: { width: "100%", m: 1 } } }}
        >
            {children}
        </Dialog>
    );
}