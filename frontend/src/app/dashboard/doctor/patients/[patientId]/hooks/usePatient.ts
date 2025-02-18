import usePatientInfo from "@/app/dashboard/doctor/patients/[patientId]/hooks/usePatientInfo";
import usePatientTests from "@/app/dashboard/doctor/patients/[patientId]/hooks/usePatientTests";
import {useEffect} from "react";

export default function usePatient(patientId: string) {
    const {
        patient,
        isLoading: patientLoading, error: patientError,
        onChangeStatus, onReadPatient
    } = usePatientInfo(patientId);

    const {
        tests,
        isLoading: testsLoading,
        error: testsError,
        onUnassign
    } = usePatientTests(patientId);

    const shouldRead = !!patient && !!tests && patient.needs_attention;
    useEffect(() => {
        if (shouldRead) onReadPatient().then();
    }, [shouldRead, onReadPatient]);

    return {
        patient,
        tests,
        isLoading: patientLoading || testsLoading,
        error: patientError || testsError,
        onChangeStatus,
        onUnassign
    };
}