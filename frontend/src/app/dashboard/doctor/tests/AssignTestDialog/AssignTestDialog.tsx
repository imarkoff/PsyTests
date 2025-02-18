"use client";

import Button from '@mui/material/Button';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import {Dialog} from "@mui/material";
import usePatients from "@/app/dashboard/doctor/tests/AssignTestDialog/usePatients";
import {useState} from "react";
import PatientCard from "@/components/PatientCard";
import DialogCloseButton from "@/components/DialogCloseButton";
import DoctorPatient from "@/schemas/DoctorPatient";

interface AssignTestDialogProps {
    testId: string;
    open: boolean;
    setOpenAction: (open: boolean) => void;
}

/**
 * Dialog for assigning a test to a patient
 * @param testId - test id to assign
 * @param open - is dialog open
 * @param setOpenAction - function to set dialog open state
 * @constructor
 */
export default function AssignTestDialog({testId, open, setOpenAction}: AssignTestDialogProps) {
    const { patients, onAssign, assignError, setAssignError } = usePatients();
    const [selectedPatient, setSelectedPatient] = useState<DoctorPatient>();

    const handleAssign = async () => {
        if (!selectedPatient) return;
        await onAssign(selectedPatient.patient.id, testId);
        setOpenAction(false);
    };

    const onChoose = (patient: DoctorPatient) => {
        setSelectedPatient(patient);
        setAssignError(undefined);
    };

    const onClose = () => setOpenAction(false);

    return (
        <Dialog
            onClose={onClose}
            aria-labelledby="dialog-title"
            open={open}
            maxWidth={"sm"}
            fullWidth
            scroll={"paper"}
            slotProps={{ paper: { elevation: 1 } }}
        >
            <DialogTitle
                sx={{ display: "flex", alignItems: "center" }}
                id="dialog-title"
                title={"Назначити тест"}
            >
                <Typography component={"span"} variant={"h6"}>
                    Назначити тест
                </Typography>
                <DialogCloseButton onClose={onClose} />
            </DialogTitle>

            <DialogContent sx={{
                p: 1,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))",
                gap: 1
            }} dividers>
                {patients && patients.map((patient) => (
                    <PatientCard
                        patient={patient}
                        key={patient.id}
                        onClick={onChoose}
                        selected={patient.id === selectedPatient?.id}
                    />
                ))}
            </DialogContent>

            <DialogActions sx={{flexWrap: "wrap"}}>
                {assignError && (
                    <Typography
                        color={"error"}
                        variant={"body2"}
                        sx={{mr: "auto", ml: 1}}
                    >
                        {assignError}
                    </Typography>
                )}
                <Button autoFocus onClick={handleAssign} disabled={!selectedPatient}>
                    Назначити {selectedPatient && `для ${selectedPatient.patient.name}`}
                </Button>
            </DialogActions>
        </Dialog>
    );
}