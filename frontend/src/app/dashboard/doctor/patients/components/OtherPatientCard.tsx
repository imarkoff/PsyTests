"use client";

import PatientCard from "@/components/PatientCard";
import User from "@/schemas/User";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import {IconButton, Tooltip} from "@mui/material";
import {useState} from "react";
import {addPatient} from "@/services/doctorPatientsService";

export default function OtherPatientCard({patient}: {patient: User}) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePutOnRecord = async () => {
        if (loading || success) return;
        setLoading(true);
        try {
            await addPatient(patient.id);
            setSuccess(true);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <PatientCard
            patient={patient}
            footer={
                <Tooltip title={success ? "Пацієнта додано" : "Додати пацієнта"}>
                    <IconButton
                        onClick={handlePutOnRecord}
                        loading={loading}
                        color={success ? "success" : "primary"}
                        sx={{
                            position: "absolute",
                            right: 6,
                            bottom: 6
                    }}
                    >
                        {success ? <CheckIcon /> : <AddIcon />}
                    </IconButton>
                </Tooltip>
            }
        />
    );
}