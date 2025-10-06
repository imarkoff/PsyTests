import {useState} from "react";
import {Button, Typography, Alert} from "@mui/material";
import useUserContext from "@/features/admin/user-modal/hooks/useUserContext";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import getDialogText from "./utils/getDialogText";
import useDeleteUser from "./hooks/useDeleteUser";
import ActionDialog from "@/components/ActionDialog";

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
    const dialogText = getDialogText(user?.role);

    const {
        handleDelete,
        isMutating,
        error,
    } = useDeleteUser(
        () => {
            setIsOpen(false);
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
                {dialogText.buttonText}
            </Button>
            <ActionDialog.Root
                open={isOpen}
                onClose={handleClose}
            >
                <ActionDialog.Header
                    header={dialogText.titleText}
                    subheader={user ? (
                        <strong>{user.surname} {user.name} {user.patronymic}</strong>
                    ) : undefined}
                    hasCloseButton
                />

                <ActionDialog.Content>
                    <Typography>
                        {dialogText.contentText}
                    </Typography>
                    {error && !isMutating && (
                        <Alert color={"error"}>
                            {error.statusText || "Сталася помилка під час видалення користувача."}
                        </Alert>
                    )}
                </ActionDialog.Content>

                <ActionDialog.Actions>
                    <ActionDialog.Button
                        onClick={handleClose}
                        disabled={isMutating}
                    >
                        Відмінити
                    </ActionDialog.Button>
                    <ActionDialog.Button
                        onClick={handleDelete}
                        color={"error"}
                        variant={"contained"}
                        disabled={isMutating}
                    >
                        Видалити
                    </ActionDialog.Button>
                </ActionDialog.Actions>
            </ActionDialog.Root>
        </>
    );
}