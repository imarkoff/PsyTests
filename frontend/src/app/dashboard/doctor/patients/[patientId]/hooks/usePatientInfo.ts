import useSWR from "swr";
import {changePatientStatus, getPatient, readPatient} from "@/services/doctorPatientsService";

export default function usePatientInfo(patientId: string) {
    const {
        data,
        isLoading, error,
        mutate: userInfoMutate
    } = useSWR(
        `getPatient/${patientId}`,
        () => getPatient(patientId)
    );
    const onChangeStatus = async (isActive: boolean) => {
        await changePatientStatus(patientId, isActive);
        await userInfoMutate(prev => prev && {
            ...prev,
            is_active: isActive
        }, false);
    }

    const onReadPatient = async () => {
        await readPatient(patientId);
        await userInfoMutate(prev => prev && {
            ...prev,
            needs_attention: false
        }, false);
    }

    return {
        patient: data,
        isLoading, error,
        onChangeStatus,
        onReadPatient
    };
}