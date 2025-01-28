"use client";

import Button from '@mui/material/Button';
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import {Dialog} from "@mui/material";
import usePatients from "@/app/dashboard/doctor/tests/AssignTestDialog/usePatients";
import {useState} from "react";
import PatientCard from "@/components/PatientCard";
import User from "@/schemas/User";

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
    const [selectedPatient, setSelectedPatient] = useState<User>();

    const handleAssign = async () => {
        if (!selectedPatient) return;
        await onAssign(selectedPatient.id, testId);
        setOpenAction(false);
    };

    const onChoose = (patient: User) => {
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
            PaperProps={{elevation: 1}}
        >
            <DialogTitle
                sx={{ display: "flex", alignItems: "center" }}
                id="dialog-title"
                title={"Назначити тест"}
            >
                <Typography component={"span"} variant={"h6"}>
                    Назначити тест
                </Typography>
                <CloseButton onClose={onClose} />
            </DialogTitle>

            <DialogContent sx={{
                p: 1,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))",
                gap: 1
            }} dividers>
                {patients?.map((patient) => (
                    <PatientCard
                        patient={patient}
                        key={patient.id}
                        onChoose={onChoose}
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
                    Назначити {selectedPatient && `для ${selectedPatient.name}`}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const CloseButton = ({onClose}: {onClose: () => void}) => {
    return (
        <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
                marginLeft: "auto",
                marginRight: -1.5,
                color: "text.secondary"
            }}
        >
            <CloseIcon />
        </IconButton>
    );
}
