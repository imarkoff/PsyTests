import useSWR from "swr";
import {getPatient} from "@/services/doctorPatientsService";
import {unassignTest} from "@/services/doctorPatientsTestsService";

export default function usePatient(patientId: string) {
    const {
        data: userInfo,
        mutate
    } = useSWR(
        `getPatient/${patientId}`,
        () => getPatient(patientId)
    );

    const onUnassign = async (testId: string) => {
        await unassignTest(patientId, testId);
        await mutate(prev => prev && ({
            ...prev,
            tests: prev.tests.filter(test => test.id !== testId)
        }), false);
    }

    return {
        patient: userInfo?.patient,
        tests: userInfo?.tests,
        onUnassign
    };
}