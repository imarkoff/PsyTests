import useSWR from "swr";
import {getPatientTests, unassignTest} from "@/services/doctorPatientsTestsService";

export default function usePatientTests(patientId: string) {
    const {
        data: tests,
        isLoading, error,
        mutate: testsMutate
    } = useSWR(
        `getPatientTests/${patientId}`,
        () => getPatientTests(patientId),
        { revalidateOnFocus: false }
    );

    const onUnassign = async (testId: string) => {
        await unassignTest(patientId, testId);
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