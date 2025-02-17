"use client";

import {Box, Button} from "@mui/material";
import {useParams, useRouter} from "next/navigation";
import TestsHistory from "@/app/dashboard/doctor/patients/[patientId]/layout/TestsHistory";
import AssignedTests from "@/app/dashboard/doctor/patients/[patientId]/layout/AssignedTests";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import usePatient from "@/app/dashboard/doctor/patients/[patientId]/hooks/usePatient";
import PatientHeader from "@/app/dashboard/doctor/patients/[patientId]/layout/PatientHeader";

export default function ClientPage() {
    const params = useParams<{ patientId: string }>();

    const {patient, tests, onUnassign} = usePatient(params.patientId);

    return (
        <Box sx={{display: "grid", gap: 3}}>
            <BackButton />

            <PatientHeader patient={patient?.patient} />

            <AssignedTests tests={tests} unassignAction={onUnassign} />

            <TestsHistory patientId={params.patientId} />
        </Box>
    );
}

const BackButton = () => {
    const router = useRouter();
    const onClick = () => router.back();

    return (
        <Button onClick={onClick} variant={"outlined"} sx={{justifySelf: "start"}} startIcon={<ArrowBackIcon />}>
            Назад
        </Button>
    );
}