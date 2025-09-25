"use client";

import {ComponentType, useState} from "react";
import {Dialog} from "@mui/material";
import useUserContext from "@/features/admin/user-modal/hooks/useUserContext";
import ChangePasswordForm from "./ChangePasswordForm";

interface ChangePasswordDialogProps {
    OpenButton: ComponentType<{ onClick: () => void, disabled: boolean }>;
}

export default function ChangePasswordDialog(
    {OpenButton}: ChangePasswordDialogProps
) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const {user} = useUserContext();

    return (
        <>
            <OpenButton
                onClick={handleOpen}
                disabled={!user}
            />
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={"sm"}
            >
                <ChangePasswordForm onClose={handleClose}/>
            </Dialog>
        </>
    );
}