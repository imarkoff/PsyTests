"use client";

import {Dialog, DialogTitle} from "@mui/material";
import UserHeaderInfo from "./components/UserHeaderInfo";
import DialogCloseButton from "@/components/DialogCloseButton";
import {useRouter} from "next/navigation";
import {useState} from "react";
import EditUserDialog from "@/features/admin/user-modal/components/EditUserDialog";
import UserProvider from "@/features/admin/user-modal/contexts/UserProvider";

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
                open={open}
                onClose={handleClose}
                maxWidth={"lg"}
            >
                <DialogTitle sx={{display: "flex", alignItems: "center", gap: 3}}>
                    <UserHeaderInfo />
                    <EditUserDialog />
                    <DialogCloseButton onClose={handleClose} />
                </DialogTitle>
            </Dialog>
        </UserProvider>
    );
}