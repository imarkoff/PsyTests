"use client";

import OpenerType from "@/components/CreatePatientDialog/OpenerType";
import {useState} from "react";
import CreatePatientForm from "@/components/CreatePatientDialog/CreatePatientForm";
import {Modal, Paper} from "@mui/material";

export default function CreatePatientDialog(
    {OpenerAction, closeAction}: {OpenerAction: OpenerType, closeAction?: () => void}
) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCreate = () => {
        handleOpen();
        closeAction?.();
    };

    return (
        <>
            <OpenerAction handleOpen={handleOpen} />
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Paper sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: 350,
                    width: '100%',
                    backgroundColor: 'background.paper',
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: 4
                }}>
                    <CreatePatientForm afterCreateAction={handleCreate} />
                </Paper>
            </Modal>
        </>
    );
}