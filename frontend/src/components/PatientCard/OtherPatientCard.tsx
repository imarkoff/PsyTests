"use client";

import PatientCard from "@/components/PatientCard/PatientCard";
import User from "@/types/models/User";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import {IconButton, Tooltip} from "@mui/material";
import useAddPatient from "@/components/PatientCard/useAddPatient";

export default function OtherPatientCard({patient}: {patient: User}) {
    const { loading, success, handlePutOnRecord } = useAddPatient(patient.id);

    return (
        <PatientCard
            patient={patient}
            footer={
                <Tooltip title={success ? "Пацієнта додано" : "Додати пацієнта"}>
                    <IconButton
                        onClick={!success ? handlePutOnRecord : undefined}
                        loading={loading}
                        data-testid="add-patient-button"
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