import useSWR from "swr";
import {getPatients} from "@/services/doctorPatientsService";
import {useState} from "react";
import {assignTest} from "@/services/doctorPatientsTestsService";
import {AxiosError} from "axios";

/**
 * Hook for getting patients and assigning tests to them
 */
export default function usePatients() {
    const { data: patients } = useSWR(getPatients.name, getPatients);
    const [assignError, setAssignError] = useState<string>();

    const onAssign = async (patientId: string, testId: string) => {
        try {
            await assignTest(patientId, testId);
        }
        catch (e) {
            if (e instanceof AxiosError && e.status === 409) {
                setAssignError("Вибраний вами тест вже назначено пацієнту");
            }
            throw e;
        }
    };

    return { patients, onAssign, assignError, setAssignError };
}