import useSWR from "swr";
import {getPatient} from "@/services/doctorPatientsService";
import {getPatientTests, unassignTest} from "@/services/doctorPatientsTestsService";

export default function usePatient(patientId: string) {
    const { data: userInfo } = useSWR(
        `getPatient/${patientId}`,
        () => getPatient(patientId)
    );

    const {
        data: tests,
        mutate: testsMutate
    } = useSWR(
        `getPatientTests/${patientId}`,
        () => getPatientTests(patientId)
    )

    const onUnassign = async (testId: string) => {
        await unassignTest(patientId, testId);
        await testsMutate(prev => prev && ({
            ...prev,
            tests: prev.filter(test => test.id !== testId)
        }), false);
    }

    return {
        patient: userInfo,
        tests: tests,
        onUnassign
    };
}