"use client";

import DoctorPatient from "@/schemas/DoctorPatient";
import {Button} from "@mui/material";
import {useState} from "react";

export default function ChangeStatusButton(
    {patient, changeAction}: {patient?: DoctorPatient, changeAction: (isActive: boolean) => Promise<void>}
) {
    const [loading, setLoading] = useState(false);

    const handleOnClick = async () => {
        setLoading(true);

        try {
            if (patient) await changeAction(!patient.is_active);
        }
        finally {
            setLoading(false);
        }

    }

    return (
        <Button
            variant={"outlined"}
            disabled={!patient}
            onClick={handleOnClick}
            loading={loading}
        >
            {patient?.is_active ? "Виписати" : "Поставити на облік"}
        </Button>
    );
}