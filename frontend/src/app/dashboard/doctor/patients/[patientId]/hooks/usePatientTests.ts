import useSWR from "swr";
import {getAllPatientTests, unassignTest} from "@/lib/controllers/doctorPatientTestController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";

export default function usePatientTests(patientId: string) {
    const {
        data: tests,
        isLoading, error,
        mutate: testsMutate
    } = useSWR(
        ["getAllPatientTests", patientId],
        ([, id]) => withSafeErrorHandling(getAllPatientTests)(id),
        { revalidateOnFocus: false }
    );

    const onUnassign = async (testId: string) => {
        await withSafeErrorHandling(unassignTest)(patientId, testId);
        await testsMutate(prev =>
                prev?.filter(test => test.id !== testId),
            false
        );
    };

    return {
        tests: tests,
        isLoading, error,
        onUnassign
    };
}