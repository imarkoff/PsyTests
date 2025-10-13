"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import DialogCloseButton from "@/components/DialogCloseButton";
import UserHeaderInfo from "./components/UserHeaderInfo";
import UserProvider from "./contexts/UserProvider";
import UserModalContent from "./dialog-content/UserModalContent";
import ActionsGroup from "@/features/admin/user-modal/components/ActionsGroup";

interface DoctorModalProps {
    userId: string;
    backRoute: string;
}

export default function UserModal(
    {userId, backRoute}: DoctorModalProps
) {
    const router = useRouter();
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => router.push(backRoute), 250);
    }

    return (
        <UserProvider userId={userId}>
            <Dialog
                id={"user-modal"}
                open={open}
                onClose={handleClose}
                maxWidth={"lg"}
            >
                <DialogTitle sx={{display: "flex", flexWrap: "wrap-reverse", alignItems: "center", gap: 1}}>
                    <UserHeaderInfo />
                    <ActionsGroup handleClose={handleClose} />
                    <DialogCloseButton onClose={handleClose} gutterRight={false} />
                </DialogTitle>
                <DialogContent>
                    <UserModalContent />
                </DialogContent>
            </Dialog>
        </UserProvider>
    );
}