"use client";

import {Alert, AlertTitle, Typography} from "@mui/material";
import PatientCard from "@/components/PatientCard/PatientCard";
import DialogContent from "@mui/material/DialogContent";
import useDoctorPatientsContext from "../hooks/contexts/useDoctorPatientsContext";
import useTestAssignmentContext from "../hooks/contexts/useTestAssignmentContext";

export default function AssignContent() {
    const {paginatedPatients, error} = useDoctorPatientsContext();
    const {selectedPatient, handleChoose} = useTestAssignmentContext();

    return (
        <DialogContent sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 2,
            pt: "2px !important"
        }}>
            {paginatedPatients?.data?.map((patient) => (
                <PatientCard
                    patient={patient.patient}
                    key={patient.patient.id}
                    selected={patient.patient.id === selectedPatient?.id}
                    onClick={() => handleChoose(patient.patient)}
                />
            ))}
            {paginatedPatients && paginatedPatients.total === 0 && (
                <Typography
                    variant={"body2"}
                    color={"textSecondary"}
                    textAlign={"center"}
                >
                    Нікого не знайдено. <br/>
                    Переконайтеся, що бажаний пацієнт на вашому обліку.
                </Typography>
            )}
            {error && (
                <Alert severity={"error"}>
                    <AlertTitle>
                        Виникла помилка при отриманні пацієнтів
                    </AlertTitle>
                    {error.statusText}
                </Alert>
            )}
        </DialogContent>
    );
}