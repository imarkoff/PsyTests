"use client";

import {ComponentType, useState} from "react";
import {Dialog} from "@mui/material";
import UserForm from "@/components/UserForm";
import UserUpdate from "@/types/forms/UserUpdate";
import usePutUserInfoApi from "../hooks/lib/usePutUserInfoApi";
import useUserContext from "../hooks/useUserContext";
import useUsersTriggerContext from "@/features/admin/user-modal/hooks/useUsersTriggerContext";

interface EditUserDialogProps {
    OpenButton: ComponentType<{onClick: () => void; disabled: boolean}>
}

export default function EditUserDialog(
    {OpenButton}: EditUserDialogProps
) {
    const [open, setOpen] = useState(false);

    const {user, changeUser} = useUserContext();
    const {handlePutUserInfo, isMutating} = usePutUserInfoApi();
    const {trigger} = useUsersTriggerContext();

    const handleOpen = () => {
        if (!!user) setOpen(true);
    }

    const handleSubmit = async (
        updateUser: UserUpdate
    ) => {
        if (!user) return;

        const response = await handlePutUserInfo(user?.id, updateUser);

        if (response.success) {
            changeUser(response.data || null);
            trigger?.();
            setOpen(false);
        }
    }

    return (
        <>
            <OpenButton
                onClick={handleOpen}
                disabled={!user}
            />
            {user && (
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <UserForm.Update
                        currentUser={user}
                        onSubmit={handleSubmit}
                        loading={isMutating}
                    />
                </Dialog>
            )}
        </>
    );
}