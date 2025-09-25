"use client";

import {Box, Button, Dialog, DialogTitle} from "@mui/material";
import UserHeaderInfo from "./components/UserHeaderInfo";
import DialogCloseButton from "@/components/DialogCloseButton";
import {useRouter} from "next/navigation";
import {useState} from "react";
import EditUserDialog from "@/features/admin/user-modal/components/EditUserDialog";
import UserProvider from "@/features/admin/user-modal/contexts/UserProvider";
import ChangePasswordDialog from "@/features/admin/user-modal/components/ChangePasswordDialog/ChangePasswordDialog";
import PasswordIcon from "@mui/icons-material/Password";

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
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "start"}}>
                        <EditUserDialog />
                        <ChangePasswordDialog
                            OpenButton={({onClick, disabled}) =>
                                <Button
                                    startIcon={<PasswordIcon/>}
                                    onClick={onClick}
                                    disabled={disabled}
                                >
                                    Змінити пароль
                                </Button>
                            }
                        />
                    </Box>
                    <DialogCloseButton onClose={handleClose} />
                </DialogTitle>
            </Dialog>
        </UserProvider>
    );
}