"use client";

import {ComponentType, useState} from "react";
import {Typography, Alert} from "@mui/material";
import useUserContext from "@/features/admin/user-modal/hooks/useUserContext";
import getDialogText from "./utils/getDialogText";
import useDeleteUser from "./hooks/useDeleteUser";
import ActionDialog from "@/components/ActionDialog";

interface DeleteUserDialogProps {
    OpenButton: ComponentType<{
        onClick: () => void;
        disabled: boolean;
        title: string;
    }>
    onUserDialogClose: () => void;
}

export default function DeleteUserDialog(
    {OpenButton, onUserDialogClose}: DeleteUserDialogProps
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
            <OpenButton
                onClick={handleOpen}
                disabled={!user}
                title={dialogText.buttonText}
            />
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