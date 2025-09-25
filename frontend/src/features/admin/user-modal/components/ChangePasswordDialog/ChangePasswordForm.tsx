"use client";

import {DialogActions, DialogContent, DialogTitle} from "@mui/material";
import DialogCloseButton from "@/components/DialogCloseButton";
import ChangePasswordTitle from "./components/ChangePasswordTitle";
import PreviousPasswordWillBecomeInvalidAlert from "./components/PreviousPasswordWillBecomeInvalidAlert";
import PasswordInput from "./components/PasswordInput";
import ChangingPasswordErrorAlert from "./components/ChangingPasswordErrorAlert";
import CancelButton from "./components/CancelButton";
import SubmitButton from "./components/SubmitButton";
import useUserContext from "@/features/admin/user-modal/hooks/useUserContext";
import usePasswordForm from "./hooks/usePasswordForm";

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
            <DialogTitle
                component={"div"}
                sx={{display: "flex", alignItems: "center", gap: 3}}
            >
                <ChangePasswordTitle user={user}/>
                <DialogCloseButton onClose={onClose}/>
            </DialogTitle>

            <DialogContent sx={{overflow: "visible", display: "flex", flexDirection: "column", gap: 2}}>
                <PreviousPasswordWillBecomeInvalidAlert/>
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
            </DialogContent>

            <DialogActions>
                <CancelButton
                    onClose={onClose}
                    isMutating={isMutating}
                />
                <SubmitButton
                    onSubmit={handleSubmit}
                    isPasswordEmpty={password.length === 0}
                    isMutating={isMutating}
                />
            </DialogActions>
        </>
    );
}