import {useState} from "react";
import {DateTime} from "luxon";
import PatientCreate, {PatientCreateForm} from "@/types/forms/PatientCreate";
import {AxiosError} from "axios";
import {usePatientsContext} from "@/features/dashboard/doctor/patients/contexts/PatientsContext";

export default function usePatientSubmit(afterCreateAction?: () => void) {
    const { createPatient } = usePatientsContext();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();

    const convertDate = (date: DateTime) => {
        const newDate = date.toISODate();
        if (!newDate) throw new Error("Невірний формат дати.");
        return newDate;
    }

    const onSubmit = async (data: PatientCreateForm) => {
        setError(undefined);
        setLoading(true);
        try {
            const transformedData: PatientCreate = {
                ...data,
                birth_date: convertDate(data.birth_date),
            }
            await createPatient(transformedData);
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