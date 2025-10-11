import {assignTest} from "@/lib/controllers/doctorPatientTestController";
import {ApiResponse} from "@/lib/api-client/types";
import PatientTest from "@/types/models/PatientTest";
import useSWRMutation from "swr/mutation";

export default function usePostAssignTestApi() {
    const fetcher = (
        _: string,
        {arg: {patientId, testId}}: { arg: { patientId: string, testId: string } }
    ): Promise<ApiResponse<PatientTest>> => (
        assignTest(patientId, testId)
    );

    const {
        data: response,
        trigger,
        isMutating,
        reset
    } = useSWRMutation(
        "/doctor/test/assign",
        fetcher
    );

    const triggerAssignTest = (
        patientId: string,
        testId: string
    ) => (
        trigger({ patientId, testId })
    );

    return {
        assignTest: triggerAssignTest,
        data: response?.data,
        isMutating,
        error: response?.error,
        reset
    };
}