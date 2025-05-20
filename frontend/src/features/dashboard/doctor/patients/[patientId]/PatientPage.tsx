"use client";

import usePatient from "@/features/dashboard/doctor/patients/[patientId]/hooks/usePatient";
import useTestsHistory from "@/features/dashboard/doctor/patients/[patientId]/hooks/useTestsHistory";
import {Box} from "@mui/material";
import BackButton from "@/features/dashboard/doctor/patients/[patientId]/components/BackButton";
import PatientHeader from "@/features/dashboard/doctor/patients/[patientId]/layout/PatientHeader";
import ChangeStatusButton from "@/features/dashboard/doctor/patients/[patientId]/components/ChangeStatusButton";
import DeletePatientButton from "@/features/dashboard/doctor/patients/[patientId]/components/DeletePatientButton";
import AssignedTests from "@/features/dashboard/doctor/patients/[patientId]/layout/AssignedTests";
import TestsHistory from "@/features/dashboard/doctor/patients/[patientId]/layout/TestsHistory";

export default function PatientPage({patientId}: { patientId: string }) {
    const { patient, tests, onUnassign, onChangeStatus } = usePatient(patientId);
    const { tests: testsHistory } = useTestsHistory(patientId);

    return (
        <Box sx={{display: "grid", gap: 3}}>
            <BackButton />
            <PatientHeader
                patient={patient}
                actions={<>
                    <ChangeStatusButton patient={patient} changeAction={onChangeStatus} />
                    <DeletePatientButton patientId={patientId} />
                </>}
            />
            <AssignedTests tests={tests} unassignAction={onUnassign} />
            <TestsHistory tests={testsHistory} />
        </Box>
    );
}