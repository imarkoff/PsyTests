"use client";

import {Button, Typography} from "@mui/material";
import UserUpdate from "@/types/forms/UserUpdate";
import User from "@/types/models/User";
import UserFormRoot from "../components/UserFormRoot";
import CredentialsFields from "../components/CredentialsFields";
import FieldsDivider from "../components/FieldsDivider";
import GenderSelect from "../components/GenderSelect";
import BirthDatePicker from "../components/BirthDatePicker";
import PhoneField from "../components/PhoneField";
import useUpdateUserForm from "../hooks/useUpdateUserForm";

interface UpdateUserForm {
    currentUser: User;
    onSubmit: (data: UserUpdate) => void;
    loading: boolean;
    error?: string;
}

export default function UpdateUserForm(
    {currentUser, onSubmit, loading, error}: UpdateUserForm
) {
    const {methods, injectedFormSubmit} = useUpdateUserForm(currentUser, onSubmit);

    return (
        <UserFormRoot
            methods={methods}
            injectedFormSubmit={injectedFormSubmit}
        >
            <CredentialsFields/>

            <FieldsDivider/>

            <GenderSelect/>
            <BirthDatePicker/>
            <PhoneField/>

            <FieldsDivider/>

            {error && <Typography color={"error"}>{error}</Typography>}
            <Button variant={"contained"} type={"submit"} loading={loading}>
                Внести зміни
            </Button>
        </UserFormRoot>
    );
}