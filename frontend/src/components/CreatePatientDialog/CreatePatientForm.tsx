"use client";

import {
    Box,
    Button,
    Divider,
    TextField,
    Typography
} from "@mui/material";
import 'dayjs/locale/uk';
import {useForm} from "react-hook-form";
import {PatientCreateForm} from "@/types/forms/PatientCreate";
import usePatientSubmit from "@/components/CreatePatientDialog/usePatientSubmit";
import GenderSelect from "@/components/CreatePatientDialog/components/GenderSelect";
import BirthDatePicker from "@/components/CreatePatientDialog/components/BirthDatePicker";

export default function CreatePatientForm({afterCreateAction}: {afterCreateAction?: () => void}) {
    const { register, handleSubmit, control } = useForm<PatientCreateForm>();
    const { onSubmit, loading, error } = usePatientSubmit(afterCreateAction);

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{padding: 1, display: "grid", gap: 1, width: "100%"}}>
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
                    Створити пацієнта
                </Button>
            </Box>
        </form>
    );
}