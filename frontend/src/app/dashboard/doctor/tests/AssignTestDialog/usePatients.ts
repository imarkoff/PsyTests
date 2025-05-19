import useSWR from "swr";
import { useState } from "react";
import { getAllPatients } from "@/lib/controllers/doctorPatientController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import { assignTest } from "@/lib/controllers/doctorPatientTestController";

/**
 * Hook for getting patients and assigning tests to them
 */
export default function usePatients() {
    const { data: patients } = useSWR("getAllPatients", withSafeErrorHandling(getAllPatients));
    const [assignError, setAssignError] = useState<string>();

    const onAssign = async (patientId: string, testId: string) => {
        setAssignError(undefined); // Clear any previous error
        const { error } = await assignTest(patientId, testId);

        if (error) {
            if (error.status === 409) {
                setAssignError("Вибраний вами тест вже назначено пацієнту");
            } else {
                setAssignError(error.statusText);
            }
        }
    };

    return { patients, onAssign, assignError, setAssignError };
}