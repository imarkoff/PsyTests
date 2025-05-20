import useSWR from "swr";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import {changePatientStatus, getPatientById, markPatientAsRead} from "@/lib/controllers/doctorPatientController";

export default function usePatientInfo(patientId: string) {
    const {
        data,
        isLoading, error,
        mutate: userInfoMutate
    } = useSWR(
        ["getPatientById", patientId],
        ([, id]) => withSafeErrorHandling(getPatientById)(id)
    );
    const onChangeStatus = async (isActive: boolean) => {
        await withSafeErrorHandling(changePatientStatus)(patientId, isActive);
        await userInfoMutate(prev => prev && {
            ...prev,
            is_active: isActive
        }, false);
    }

    const onReadPatient = async () => {
        await withSafeErrorHandling(markPatientAsRead)(patientId);
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