"use client";

import {Box, Button, Divider, TextField, Typography} from "@mui/material";
import {Roles} from "@/types/enums/Role";
import UserCreate from "@/types/forms/UserCreate";
import {CREATE_USER_BY_ROLE} from "./constants";
import GenderSelect from "./components/GenderSelect";
import BirthDatePicker from "./components/BirthDatePicker";
import useCreateUserForm from "@/components/CreateUserForm/hooks/useCreateUserForm";

interface CreateUserFormProps {
    action: {
        onSubmit: (data: UserCreate) => void;
        loading: boolean;
        error?: string;
    };
    userRole: Roles;
}

export default function CreateUserForm(
    {action: {onSubmit, loading, error}, userRole}: CreateUserFormProps
) {
    const {
        register, control, handleFormSubmit
    } = useCreateUserForm(
        onSubmit, userRole
    );

    return (
        <form onSubmit={handleFormSubmit} noValidate>
            <Box sx={{padding: 1, display: "grid", gap: 1, width: {xs: "100%", md: 350}}}>
                <TextField {...register("surname", {required: true})} label={"Прізвище"} required />
                <TextField {...register("name", {required: true})} label={"Ім'я"} required />
                <TextField {...register("patronymic")} label={"По батькові"} />

                <Divider sx={{width: "50%", my: 0.25, mx: "auto"}} />

                <GenderSelect control={control} />
                <BirthDatePicker control={control} />
                <TextField
                    {...register("phone", {required: true})}
                    label={"Номер телефону"}
                    placeholder={"+380123456789"}
                    required
                />
                <TextField
                    {...register("password", {required: true})}
                    label={"Пароль"}
                    type={"password"}
                    required
                />

                <Divider sx={{width: "50%", my: 0.25, mx: "auto"}} />

                {error && <Typography color={"error"}>{error}</Typography>}
                <Button variant={"contained"} type={"submit"} loading={loading}>
                    {CREATE_USER_BY_ROLE[userRole]}
                </Button>
            </Box>
        </form>
    );
}