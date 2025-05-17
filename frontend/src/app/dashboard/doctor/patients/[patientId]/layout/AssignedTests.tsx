"use client";

import PatientTest from "@/schemas/PatientTest";
import PatientSection from "@/app/dashboard/doctor/patients/[patientId]/components/PatientSection";
import AssignedTestCard from "@/components/Test/AssignedTestCard";
import useSWR from "swr";
import {Typography} from "@mui/material";
import { getMe } from "@/lib/controllers/userController";
import SafeError from "@/lib/api-client/SafeError";

interface AssignedTestsProps {
    tests?: PatientTest[];
    unassignAction: (testId: string) => void;
}

const fetchMe = async () => {
    const { data, error } = await getMe();
    if (error) throw SafeError.fromJSON(error.originalError);
    return data;
}

export default function AssignedTests({tests, unassignAction}: AssignedTestsProps) {
    const { data: me } = useSWR("getMe", fetchMe);

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