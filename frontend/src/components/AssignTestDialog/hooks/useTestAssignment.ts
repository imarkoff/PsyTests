import usePatients from "@/components/AssignTestDialog/hooks/usePatients";
import {useState} from "react";
import User from "@/schemas/User";

export default function useTestAssignment(
    testId: string,
    setOpenAction: (open: boolean) => void
) {
    const { patients, onAssign, assignError, setAssignError } = usePatients();
    const [selectedPatient, setSelectedPatient] = useState<User>();

    const handleAssign = async () => {
        if (!selectedPatient) return;
        await onAssign(selectedPatient.id, testId);
        setOpenAction(false);
    };

    const handleChoose = (patient: User) => {
        setSelectedPatient(patient);
        setAssignError(undefined);
    };

    const handleClose = () => setOpenAction(false);

    return {
        patients,
        selectedPatient,
        assignError,
        handleAssign,
        handleChoose,
        handleClose
    }
}