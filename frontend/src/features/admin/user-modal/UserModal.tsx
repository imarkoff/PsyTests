"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import PasswordIcon from "@mui/icons-material/Password";
import {Box, Button, Dialog, DialogContent, DialogTitle} from "@mui/material";
import DialogCloseButton from "@/components/DialogCloseButton";
import UserHeaderInfo from "./components/UserHeaderInfo";
import EditUserDialog from "./components/EditUserDialog";
import ChangePasswordDialog from "./components/ChangePasswordDialog/ChangePasswordDialog";
import DeleteUserDialog from "./components/DeleteUserDialog";
import UserProvider from "./contexts/UserProvider";
import UserModalContent from "./dialog-content/UserModalContent";

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
                        <DeleteUserDialog onUserDialogClose={handleClose} />
                    </Box>
                    <DialogCloseButton onClose={handleClose} />
                </DialogTitle>
                <DialogContent>
                    <UserModalContent />
                </DialogContent>
            </Dialog>
        </UserProvider>
    );
}