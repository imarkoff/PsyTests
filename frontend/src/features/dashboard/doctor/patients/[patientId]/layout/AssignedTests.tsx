"use client";

import PatientTest from "@/schemas/PatientTest";
import PatientSection from "@/features/dashboard/doctor/patients/[patientId]/components/PatientSection";
import AssignedTestCard from "@/components/Test/AssignedTestCard";
import useSWR from "swr";
import {Typography} from "@mui/material";
import { getMe } from "@/lib/controllers/userController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";

interface AssignedTestsProps {
    tests?: PatientTest[];
    unassignAction: (testId: string) => void;
}

export default function AssignedTests({tests, unassignAction}: AssignedTestsProps) {
    const { data: me } = useSWR("getMe", withSafeErrorHandling(getMe));

    return (
        <PatientSection title={"Назначені тести"}>
            {tests?.map(test => (
                <AssignedTestCard
                    key={test.id}
                    test={test}
                    onDelete={me?.id === test.assigned_by_id ? unassignAction : undefined}
                />
            ))}
            {!tests?.length && (
                <Typography sx={{alignSelf: "center", width: "fit-content", color: "text.secondary"}}>
                    Немає назначених тестів
                </Typography>
            )}
        </PatientSection>
    );
}