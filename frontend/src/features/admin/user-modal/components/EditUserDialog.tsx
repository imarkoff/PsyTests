"use client";

import User from "@/types/models/User";
import {useState} from "react";
import {Button, Dialog} from "@mui/material";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import UserForm from "@/components/UserForm";
import usePutUserInfoApi from "@/features/admin/user-modal/hooks/usePutUserInfoApi";
import UserUpdate from "@/types/forms/UserUpdate";

interface EditUserButtonProps {
    user: User | null;
}

export default function EditUserDialog(
    {user}: EditUserButtonProps
) {
    const [open, setOpen] = useState(false);

    const {
        response, handlePutUserInfo, isMutating
    } = usePutUserInfoApi();

    const handleOpen = () => {
        if (!!user) {
            setOpen(true);
        }
    }

    const handleSubmit = async (
        updateUser: UserUpdate
    ) => {
        if (!user) return;

        await handlePutUserInfo(user?.id, updateUser);

        if (response?.success) {
            setOpen(false);
        }
    }

    return (
        <>
            <Button
                startIcon={<EditRoundedIcon />}
                onClick={handleOpen}
                disabled={!user}
            >
                Змінити дані
            </Button>
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