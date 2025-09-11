"use client";

import {Dialog, DialogTitle} from "@mui/material";
import User from "@/types/models/User";
import {ApiResponse} from "@/lib/api-client/types";
import UserHeaderInfo from "./components/UserHeaderInfo";
import DialogCloseButton from "@/components/DialogCloseButton";
import {useRouter} from "next/navigation";
import {useState} from "react";
import EditUserDialog from "@/features/admin/user-modal/components/EditUserDialog";

interface DoctorModalProps {
    userResponse: ApiResponse<User>;
    backRoute: string;
}

export default function UserModal(
    {userResponse, backRoute}: DoctorModalProps
) {
    const router = useRouter();
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => router.push(backRoute), 250);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={"lg"}
        >
            <DialogTitle sx={{display: "flex", alignItems: "center", gap: 3}}>
                <UserHeaderInfo user={userResponse.data ?? null} />
                <EditUserDialog user={userResponse.data ?? null} />
                <DialogCloseButton onClose={handleClose} />
            </DialogTitle>
        </Dialog>
    );
}