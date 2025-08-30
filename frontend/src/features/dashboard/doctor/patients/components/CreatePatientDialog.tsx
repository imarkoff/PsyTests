"use client";

import {ComponentType, useState} from "react";
import {Dialog} from "@mui/material";
import CreatePatientForm from "./CreatePatientForm";

interface CreatePatientDialogProps {
    OpenerAction: ComponentType<{ handleOpen: () => void }>;
    closeAction?: () => void;
}

export default function CreatePatientDialog(
    {OpenerAction, closeAction}: CreatePatientDialogProps
) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCreate = () => {
        handleClose();
        closeAction?.();
    };

    return (
        <>
            <OpenerAction handleOpen={handleOpen} />
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <CreatePatientForm afterCreateAction={handleCreate} />
            </Dialog>
        </>
    );
}