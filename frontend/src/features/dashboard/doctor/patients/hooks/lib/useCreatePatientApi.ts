import UserCreate from "@/types/forms/UserCreate";
import useSWRMutation from "swr/mutation";
import {createPatient} from "@/lib/controllers/doctorPatientController";

export default function useCreatePatientApi(afterCreateAction?: () => void) {
    const fetcher = async (
        _: string,
        {arg}: { arg: UserCreate; }
    ) => (
        createPatient(arg)
    );

    const {
        trigger,
        isMutating,
        data: response
    } = useSWRMutation(
        "createPatient",
        fetcher
    );

    const handlePatientCreate = async (newPatient: UserCreate) => {
        await trigger(newPatient);
        afterCreateAction?.();
    };

    return {
        handlePatientCreate,
        loading: isMutating,
        error: response?.error?.statusText
    };
}