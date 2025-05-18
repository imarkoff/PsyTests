import useSWR from "swr";
import {getTestResultsByPatient} from "@/lib/controllers/doctorPatientTestController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";

export default function useTestsHistory(patientId: string) {
    const {
        data: tests,
        isLoading, error,
    } = useSWR(
        ["getTestResultsByPatient", patientId],
        ([, id]) => withSafeErrorHandling(getTestResultsByPatient)(id)
    );

    return {
        tests, isLoading, error
    };
}