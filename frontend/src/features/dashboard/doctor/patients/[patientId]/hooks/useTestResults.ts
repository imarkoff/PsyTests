import useSWR from "swr";
import {getTestResultsByPatient} from "@/lib/controllers/doctorPatientTestController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";

export default function useTestResults(patientId: string) {
    const {
        data: testResults,
        isLoading, error,
    } = useSWR(
        ["getTestResultsByPatient", patientId],
        ([, id]) => withSafeErrorHandling(getTestResultsByPatient)(id)
    );

    return {
        testResults, isLoading, error
    };
}