"use client";

import UserFormRoot from "../components/UserFormRoot";
import CredentialsFields from "@/components/UserForm/components/CredentialsFields";
import FieldsDivider from "@/components/UserForm/components/FieldsDivider";
import GenderSelect from "@/components/UserForm/components/GenderSelect";
import BirthDatePicker from "@/components/UserForm/components/BirthDatePicker";
import PhoneField from "@/components/UserForm/components/PhoneField";
import {Button, Typography} from "@mui/material";
import UserUpdate from "@/types/forms/UserUpdate";
import User from "@/types/models/User";
import {useForm} from "react-hook-form";
import {DateTime} from "luxon";

interface UpdateUserForm {
    currentUser: User;
    onSubmit: (data: UserUpdate) => void;
    loading: boolean;
    error?: string;
}

export default function UpdateUserForm(
    {currentUser, onSubmit, loading, error}: UpdateUserForm
) {
    const methods = useForm<UserUpdate>({
        defaultValues: {
            surname: currentUser.surname,
            name: currentUser.name,
            patronymic: currentUser.patronymic,
            birth_date: DateTime.fromISO(currentUser.birth_date),
            gender: currentUser.gender,
            phone: currentUser.phone
        }
    });

    const injectedFormSubmit = methods.handleSubmit(onSubmit);

    return (
        <UserFormRoot
            methods={methods}
            injectedFormSubmit={injectedFormSubmit}
        >
            <CredentialsFields/>

            <FieldsDivider/>

            <GenderSelect />
            <BirthDatePicker/>
            <PhoneField/>

            <FieldsDivider/>

            {error && <Typography color={"error"}>{error}</Typography>}
            <Button variant={"contained"} type={"submit"} loading={loading}>
                Внести зміни
            </Button>
        </UserFormRoot>
    )
}