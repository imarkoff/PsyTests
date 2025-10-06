"use client";

import DoctorPatient from "@/types/models/DoctorPatient";
import {Button} from "@mui/material";
import {useState} from "react";

export default function ChangeStatusButton(
    {patient, changeAction}: {patient?: DoctorPatient, changeAction: (isActive: boolean) => Promise<void>}
) {
    const [loading, setLoading] = useState(false);

    const isActive = patient?.unassigned_at === null;

    const handleOnClick = async () => {
        setLoading(true);

        try {
            if (patient) {
                await changeAction(!isActive);
            }
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
            {isActive ? "Виписати" : "Поставити на облік"}
        </Button>
    );
}