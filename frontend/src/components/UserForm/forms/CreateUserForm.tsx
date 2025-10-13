"use client";

import {Button, Typography} from "@mui/material";
import {Roles} from "@/types/enums/Role";
import UserCreate from "@/types/forms/UserCreate";
import {CREATE_USER_BY_ROLE} from "../constants";
import GenderSelect from "../components/GenderSelect";
import BirthDatePicker from "../components/BirthDatePicker";
import useCreateUserForm from "../hooks/useCreateUserForm";
import CredentialsFields from "../components/CredentialsFields";
import FieldsDivider from "../components/FieldsDivider";
import PhoneField from "../components/PhoneField";
import PasswordField from "../components/PasswordField";
import UserFormRoot from "../components/UserFormRoot";

interface CreateUserFormProps {
    onSubmit: (data: UserCreate) => void;
    loading: boolean;
    error?: string;
    userRole: Roles;
}

export default function CreateUserForm(
    {onSubmit, loading, error, userRole}: CreateUserFormProps
) {
    const {
        injectedFormSubmit, ...methods
    } = useCreateUserForm(
        onSubmit, userRole
    );

    return (
        <UserFormRoot
            injectedFormSubmit={injectedFormSubmit}
            methods={methods}
        >
            <CredentialsFields/>

            <FieldsDivider/>

            <GenderSelect/>
            <BirthDatePicker/>
            <PhoneField/>
            <PasswordField/>

            <FieldsDivider/>

            {error && <Typography color={"error"}>{error}</Typography>}
            <Button variant={"contained"} type={"submit"} loading={loading}>
                {CREATE_USER_BY_ROLE[userRole]}
            </Button>
        </UserFormRoot>
    );
}