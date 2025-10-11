import {useState} from "react";
import User from "@/types/models/User";
import usePostAssignTestApi from "@/components/AssignTestDialog/hooks/lib/usePostAssignTestApi";
import {ApiResponseError} from "@/lib/api-client/types";

export interface UseTestAssignmentReturn {
    isMutating: boolean;
    error: ApiResponseError | null;
    selectedPatient: User | null;
    handleAssign: () => Promise<void>;
    handleChoose: (patient: User) => void;
    handleClose: () => void;
}

export default function useTestAssignment(
    testId: string,
    setOpenAction: (open: boolean) => void
): UseTestAssignmentReturn {
    const {
        assignTest,
        isMutating,
        error,
        reset
    } = usePostAssignTestApi();

    const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

    const handleAssign = async () => {
        if (!selectedPatient) return;
        const response = await assignTest(
            selectedPatient.id, testId
        );

        if (response?.success) {
            setOpenAction(false);
            setSelectedPatient(null);
            reset();
        }
    };

    const handleChoose = (patient: User) => {
        setSelectedPatient(patient);
        reset();
    };

    const handleClose = () => {
        setOpenAction(false);
        setSelectedPatient(null);
    };

    return {
        isMutating,
        error: error ?? null,
        selectedPatient,
        handleAssign,
        handleChoose,
        handleClose
    };
}