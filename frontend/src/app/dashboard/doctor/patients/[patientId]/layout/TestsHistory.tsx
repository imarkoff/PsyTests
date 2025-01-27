"use client";

import useSWR from "swr";
import {getHistory} from "@/services/doctorPatientsTestsService";
import TestHistoryCard from "@/components/Test/TestHistoryCard";
import PatientSection from "@/app/dashboard/doctor/patients/[patientId]/components/PatientSection";
import {Typography} from "@mui/material";

export default function TestsHistory({patientId}: {patientId: string}) {
    const {
        data: tests
    } = useSWR(
        `${getHistory.name}/${patientId}`,
        () => getHistory(patientId)
    );

    return (
        <PatientSection title={"Історія проходження тестів"} colSize={400}>
            {tests?.map(test => (
                <TestHistoryCard test={test} key={test.id} />
            ))}
            {!tests?.length && (
                <Typography sx={{alignSelf: "center", width: "fit-content", color: "text.secondary"}}>
                    Історія проходження тестів відсутня
                </Typography>
            )}
        </PatientSection>
    );
}