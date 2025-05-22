"use client";

import {Box} from "@mui/material";
import BackButton from "@/features/dashboard/doctor/patients/[patientId]/components/BackButton";
import PatientHeader from "@/features/dashboard/doctor/patients/[patientId]/layout/PatientHeader/PatientHeader";
import AssignedTestsSection from "@/features/dashboard/doctor/patients/[patientId]/layout/AssignedTestsSection";
import TestResultsSection from "@/features/dashboard/doctor/patients/[patientId]/layout/TestResultsSection";
import usePatientInfo from "@/features/dashboard/doctor/patients/[patientId]/hooks/usePatientInfo";

export default function PatientPage({patientId}: { patientId: string }) {
    const { doctorPatient, onChangeStatus, onReadPatient } = usePatientInfo(patientId);

    return (
        <Box sx={{display: "grid", gap: 3}}>
            <BackButton />
            <PatientHeader
                doctorPatient={doctorPatient}
                onChangeStatus={onChangeStatus}
            />
            <AssignedTestsSection patientId={patientId} />
            <TestResultsSection
                patientId={patientId}
                doctorPatient={doctorPatient}
                readPatientAction={onReadPatient}
            />
        </Box>
    );
}