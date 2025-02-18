import {useState} from "react";
import {DateTime} from "luxon";
import PatientCreate from "@/schemas/PatientCreate";
import {AxiosError} from "axios";
import {usePatientsContext} from "@/app/dashboard/doctor/patients/context/PatientsContext";

export default function usePatientSubmit(afterCreateAction?: () => void) {
    const { createPatient } = usePatientsContext();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();

    const convertDate = (date: string) => {
        const newDate = DateTime.fromFormat(date, "dd.MM.yyyy").toISODate();
        if (!newDate) throw new Error("Невірний формат дати.");
        return newDate;
    }

    const onSubmit = async (data: PatientCreate) => {
        setError(undefined);
        setLoading(true);
        try {
            data.birth_date = convertDate(data.birth_date);
            await createPatient(data);
            afterCreateAction?.();
        } catch (e) {
            if (e instanceof AxiosError && e.response?.status === 409) {
                setError("Пацієнт з таким номером телефону вже існує.");
            }
            else if (e instanceof Error) {
                setError(e.message);
            }
            else {
                setError("Невідома помилка.");
            }

        }
        finally {
            setLoading(false);
        }
    }

    return {onSubmit, loading, error};
}