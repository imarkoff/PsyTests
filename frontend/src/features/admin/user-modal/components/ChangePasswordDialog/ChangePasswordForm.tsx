"use client";

import {Alert} from "@mui/material";
import PasswordInput from "./components/PasswordInput";
import ChangingPasswordErrorAlert from "./components/ChangingPasswordErrorAlert";
import useUserContext from "@/features/admin/user-modal/hooks/useUserContext";
import usePasswordForm from "./hooks/usePasswordForm";
import ActionDialog from "@/components/ActionDialog";

interface ChangePasswordFormProps {
    onClose: () => void;
}

export default function ChangePasswordForm(
    {onClose}: ChangePasswordFormProps
) {
    const {user} = useUserContext();

    const {
        response, isMutating,
        password, setPassword, handleSubmit
    } = usePasswordForm(
        user,
        onClose
    );
    
    return (
        <>
            <ActionDialog.Header
                header={"Зміна пароля користувача"}
                subheader={user ? (
                    <>
                        Для <strong>{user.surname} {user.name} {user.patronymic}</strong>
                    </>
                ) : undefined}
                hasCloseButton
            />

            <ActionDialog.Content sx={{overflow: "visible"}}>
                <Alert severity={"warning"}>
                    Після зміни пароля, попередній пароль буде недійсний.
                </Alert>
                <PasswordInput
                    label={"Новий пароль"}
                    placeholder={"Введіть новий пароль"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isMutating}
                />
                {response?.error && !isMutating && (
                    <ChangingPasswordErrorAlert
                        message={response.error.statusText}
                    />
                )}
            </ActionDialog.Content>

            <ActionDialog.Actions>
                <ActionDialog.Button
                    onClick={onClose}
                    disabled={isMutating}
                >
                    Відмінити
                </ActionDialog.Button>
                <ActionDialog.Button
                    variant={"contained"}
                    onClick={handleSubmit}
                    disabled={password.length === 0}
                    loading={isMutating}
                >
                    Зберегти
                </ActionDialog.Button>
            </ActionDialog.Actions>
        </>
    );
}