import useSWR from "swr";
import {getHistory} from "@/services/doctorPatientsTestsService";

export default function useTestsHistory(patientId: string) {
    const {
        data: tests,
        isLoading, error,
    } = useSWR(
        `getHistory/${patientId}`,
        () => getHistory(patientId)
    );

    return {
        tests, isLoading, error
    };
}