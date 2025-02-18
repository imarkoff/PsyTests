"use client";

import {Box, Button, Divider, TextField, Typography} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/uk';
import {useForm} from "react-hook-form";
import PatientCreate from "@/schemas/PatientCreate";
import usePatientSubmit from "@/components/CreatePatient/usePatientSubmit";

export default function CreatePatientForm({afterCreateAction}: {afterCreateAction?: () => void}) {
    const { register, handleSubmit } = useForm<PatientCreate>();
    const { onSubmit, loading, error } = usePatientSubmit(afterCreateAction);

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{padding: 1, display: "grid", gap: 1, width: "100%"}}>
                <TextField {...register("surname", {required: true})} label={"Прізвище"} required />
                <TextField {...register("name", {required: true})} label={"Ім'я"} required />
                <TextField {...register("patronymic")} label={"По батькові"} />

                <Divider sx={{width: "50%", my: 0.25, mx: "auto"}} />

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"uk"}>
                    <DatePicker
                        label={"Дата народження"}
                        slotProps={{
                            textField: {
                                ...register("birth_date", {required: true}),
                                required: true
                            }
                        }}
                    />
                </LocalizationProvider>
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