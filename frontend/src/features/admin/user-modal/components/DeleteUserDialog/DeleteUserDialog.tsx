import {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Alert, Box} from "@mui/material";
import DialogCloseButton from "@/components/DialogCloseButton";
import useUserContext from "@/features/admin/user-modal/hooks/useUserContext";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import getDialogText from "./utils/getDialogText";
import useDeleteUser from "./hooks/useDeleteUser";

interface DeleteUserDialogProps {
    onUserDialogClose: () => void;
}

export default function DeleteUserDialog(
    {onUserDialogClose}: DeleteUserDialogProps
) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);

    const {user} = useUserContext();

    const {
        handleDelete,
        isMutating,
        error,
    } = useDeleteUser(
        () => {
            handleClose();
            onUserDialogClose();
        }
    );

    return (
        <>
            <Button
                color={"error"}
                onClick={handleOpen}
                disabled={!user}
                startIcon={<DeleteForeverIcon/>}
            >
                {getDialogText(user?.role).buttonText}
            </Button>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                fullWidth
                slotProps={{paper: {sx: {maxWidth: "400px"}}}}
            >
                <DialogTitle
                    component={"div"}
                    sx={{display: "flex", alignItems: "center", gap: 3}}
                >
                    <Box>
                        <Typography component={"h2"} variant={"h6"}>
                            {getDialogText(user?.role).titleText}
                        </Typography>
                        {user && (
                            <Typography variant="body2" sx={{color: "text.secondary"}}>
                                <strong>{user.surname} {user.name} {user.patronymic}</strong>
                            </Typography>
                        )}
                    </Box>
                    <DialogCloseButton onClose={handleClose}/>
                </DialogTitle>

                <DialogContent sx={{overflow: "visible", display: "flex", flexDirection: "column", gap: 2}}>
                    <Typography>
                        {getDialogText(user?.role).contentText}
                    </Typography>
                    {error && !isMutating && (
                        <Alert color={"error"}>
                            {error.statusText || "Сталася помилка під час видалення користувача."}
                        </Alert>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleClose}
                        disabled={isMutating}
                        fullWidth
                    >
                        Відмінити
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color={"error"}
                        variant={"contained"}
                        fullWidth
                        disabled={isMutating}
                    >
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}