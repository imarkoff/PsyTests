"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import DialogCloseButton from "@/components/DialogCloseButton";
import UserHeaderInfo from "./components/UserHeaderInfo";
import UserProvider from "./contexts/UserProvider";
import UserModalContent from "./dialog-content/UserModalContent";
import MoreMenu from "@/features/admin/user-modal/components/MoreMenu";

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
                <DialogTitle sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <UserHeaderInfo />
                    <MoreMenu handleClose={handleClose} />
                    <DialogCloseButton onClose={handleClose} sx={{m:0}} />
                </DialogTitle>
                <DialogContent>
                    <UserModalContent />
                </DialogContent>
            </Dialog>
        </UserProvider>
    );
}