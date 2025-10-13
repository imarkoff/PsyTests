"use client";

import {useState} from "react";
import {Button, Dialog} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UserFormDialog from "@/components/UserForm";
import useUsersContext from "../hooks/useUsersContext";
import useCreateUserApi from "../hooks/lib/useCreateUserApi";
import useUsersTriggerContext from "@/features/admin/user-modal/hooks/useUsersTriggerContext";

export default function CreateUserDialog() {
    const [open, setOpen] = useState(false);

    const {grid: {toolbar}, role} = useUsersContext();
    const {trigger} = useUsersTriggerContext();

    const afterCreate = () => {
        setOpen(false);
        trigger?.();
    }

    const {createUser, loading, error} = useCreateUserApi(afterCreate);

    return (
        <>
            <Button
                variant={"contained"}
                onClick={() => setOpen(true)}
                startIcon={<AddIcon/>}
            >
                {toolbar.createButtonText}
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <UserFormDialog.Create
                    onSubmit={createUser}
                    loading={loading}
                    error={error}
                    userRole={role}
                />
            </Dialog>
        </>
    );
}