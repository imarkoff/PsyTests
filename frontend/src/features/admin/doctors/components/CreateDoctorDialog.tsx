"use client";

import {useState} from "react";
import {Button, Dialog} from "@mui/material";
import CreateUserForm from "@/components/CreateUserForm";
import {Roles} from "@/types/enums/Role";
import useCreateUserApi from "../hooks/lib/useCreateUserApi";
import AddIcon from "@mui/icons-material/Add";

export default function CreateDoctorDialog() {
    const [open, setOpen] = useState(false);

    const {
        trigger, loading, error
    } = useCreateUserApi(
        () => setOpen(false)
    );

    return (
        <>
            <Button
                variant={"contained"}
                onClick={() => setOpen(true)}
                startIcon={<AddIcon />}
            >
                Додати лікаря
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <CreateUserForm
                    action={{
                        onSubmit: trigger,
                        loading,
                        error
                    }}
                    userRole={Roles.doctor}
                />
            </Dialog>
        </>
    );
}