import UserCreate from "@/types/forms/UserCreate";
import {usePatientsContext} from "../../contexts/PatientsContext";
import useSWRMutation from "swr/mutation";

export default function useCreatePatientApi(afterCreateAction?: () => void) {
    const { createPatient } = usePatientsContext();

    const fetcher = async (
        _: string,
        {arg}: { arg: UserCreate; }
    ) => {
        await createPatient(arg);
        afterCreateAction?.();
    }

    const {
        trigger,
        isMutating,
        error
    } = useSWRMutation(
        "createPatient",
        fetcher
    );

    return {
        onSubmit: trigger,
        loading: isMutating,
        error
    };
}