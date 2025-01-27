import {Box, Button, Card, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import {usePatientsContext} from "@/app/dashboard/doctor/patients/context/PatientsContext";
import PatientCreate from "@/schemas/PatientCreate";
import {useState} from "react";
import {AxiosError} from "axios";

export default function CreatePatient() {
    const { register, handleSubmit } = useForm<PatientCreate>();
    const { createPatient } = usePatientsContext();

    const [onCreateError, setOnCreateError] = useState<string>();

    const onSubmit = async (data: PatientCreate) => {
        setOnCreateError(undefined);
        try {
            await createPatient(data);
        } catch (e) {
            if (e instanceof AxiosError && e.response?.status === 409) {
                setOnCreateError("Пацієнт з таким номером телефону вже існує.");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card sx={{padding: 2, display: "grid", gap: 2, width: "100%"}}>
                <Box sx={{display: "flex", gap: 2}}>
                    <TextField {...register("name", {required: true})} label={"Ім'я"} required />
                    <TextField {...register("surname")} label={"Прізвище"} />
                </Box>
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
                {onCreateError && <Typography color={"error"}>{onCreateError}</Typography>}
                <Button variant={"contained"} type={"submit"}>
                    Створити пацієнта
                </Button>
            </Card>
        </form>
    );
}