"use client";

import {Box} from "@mui/material";
import {useParams} from "next/navigation";
import TestsHistory from "@/app/dashboard/doctor/patients/[patientId]/layout/TestsHistory";
import AssignedTests from "@/app/dashboard/doctor/patients/[patientId]/layout/AssignedTests";
import PatientHeader from "@/app/dashboard/doctor/patients/[patientId]/layout/PatientHeader";
import usePatient from "@/app/dashboard/doctor/patients/[patientId]/hooks/usePatient";
import useTestsHistory from "@/app/dashboard/doctor/patients/[patientId]/hooks/useTestsHistory";
import BackButton from "@/app/dashboard/doctor/patients/[patientId]/components/BackButton";
import ChangeStatusButton from "@/app/dashboard/doctor/patients/[patientId]/components/ChangeStatusButton";
import DeletePatientButton from "@/app/dashboard/doctor/patients/[patientId]/components/DeletePatientButton";

export default function ClientPage() {
    const params = useParams<{ patientId: string }>();

    const { patient, tests, onUnassign, onChangeStatus } = usePatient(params.patientId);
    const { tests: testsHistory } = useTestsHistory(params.patientId);

    return (
        <Box sx={{display: "grid", gap: 3}}>
            <BackButton />
            <PatientHeader
                patient={patient}
                actions={<>
                    <ChangeStatusButton patient={patient} changeAction={onChangeStatus} />
                    <DeletePatientButton patientId={params.patientId} />
                </>}
            />
            <AssignedTests tests={tests} unassignAction={onUnassign} />
            <TestsHistory tests={testsHistory} />
        </Box>
    );
}