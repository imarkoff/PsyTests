import {Button, Card, Divider, TextField, Typography} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/uk';
import {useForm} from "react-hook-form";
import {usePatientsContext} from "@/app/dashboard/doctor/patients/context/PatientsContext";
import PatientCreate from "@/schemas/PatientCreate";
import {useState} from "react";
import {AxiosError} from "axios";
import {DateTime} from "luxon";

export default function CreatePatient() {
    const { register, handleSubmit } = useForm<PatientCreate>();
    const { createPatient } = usePatientsContext();

    const [onCreateError, setOnCreateError] = useState<string>();

    const convertDate = (date: string) => {
        const newDate = DateTime.fromFormat(date, "dd.MM.yyyy").toISODate();
        if (!newDate) throw new Error("Невірний формат дати.");
        return newDate;
    }

    const onSubmit = async (data: PatientCreate) => {
        console.log(data);
        setOnCreateError(undefined);
        try {
            data.birth_date = convertDate(data.birth_date);
            await createPatient(data);
        } catch (e) {
            if (e instanceof AxiosError && e.response?.status === 409) {
                setOnCreateError("Пацієнт з таким номером телефону вже існує.");
            }
            else if (e instanceof Error) {
                setOnCreateError(e.message);
            }
            else {
                setOnCreateError("Невідома помилка.");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card sx={{padding: 1, display: "grid", gap: 1, width: "100%"}}>
                <TextField {...register("name", {required: true})} label={"Ім'я"} required />
                <TextField {...register("surname")} label={"Прізвище"} />
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

                {onCreateError && <Typography color={"error"}>{onCreateError}</Typography>}
                <Button variant={"contained"} type={"submit"}>
                    Створити пацієнта
                </Button>
            </Card>
        </form>
    );
}