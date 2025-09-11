"use client";

import {TextField} from "@mui/material";
import {useFormContext} from "react-hook-form";

export default function CredentialsFields() {
    const { register } = useFormContext();

    return (
        <>
            <TextField {...register("surname", {required: true})} label={"Прізвище"} required />
            <TextField {...register("name", {required: true})} label={"Ім'я"} required />
            <TextField {...register("patronymic")} label={"По батькові"} />
        </>
    );
}