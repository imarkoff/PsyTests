"use client";

import {Dialog} from "@mui/material";
import AssignHeader from "@/components/AssignTestDialog/components/AssignHeader";
import AssignContent from "@/components/AssignTestDialog/components/AssignContent";
import AssignActions from "@/components/AssignTestDialog/components/AssignActions";
import useTestAssignment from "@/components/AssignTestDialog/hooks/useTestAssignment";

interface AssignTestDialogProps {
    testId: string;
    open: boolean;
    setOpenAction: (open: boolean) => void;
}

/**
 * Dialog component that allows doctors to assign a medical test to a patient.
 * Displays a list of available patients and handles the assignment process.
 *
 * @param testId - ID of the test to be assigned to a patient
 * @param open - Controls dialog visibility state
 * @param setOpenAction - Function to update dialog open/close state
 */
export default function AssignTestDialog({testId, open, setOpenAction}: AssignTestDialogProps) {
    const {
        patients, selectedPatient,
        assignError,
        handleClose, handleChoose, handleAssign
    } = useTestAssignment(testId, setOpenAction);

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="dialog-title"
            open={open}
            maxWidth={"sm"}
            fullWidth
            scroll={"paper"}
            slotProps={{ paper: { elevation: 1 } }}
        >
            <AssignHeader onClose={handleClose} />
            <AssignContent
                patients={patients}
                onChoose={handleChoose}
                selectedPatient={selectedPatient}
            />
            <AssignActions
                selectedPatient={selectedPatient}
                assignError={assignError}
                handleAssign={handleAssign}
            />
        </Dialog>
    );
}