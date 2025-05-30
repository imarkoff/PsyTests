"use client";

import {Modal} from "@mui/material";
import {useState} from "react";
import FindModalOpener from "@/components/FindPatientDialog/components/FindModalOpener";
import FindPatientContent from "@/components/FindPatientDialog/components/FindPatientContent";

export default function FindPatientDialog() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <FindModalOpener handleOpen={handleOpen} />
            <Modal open={open} onClose={handleClose}>
                <FindPatientContent open={open} onClose={handleClose} />
            </Modal>
        </div>
    );
}