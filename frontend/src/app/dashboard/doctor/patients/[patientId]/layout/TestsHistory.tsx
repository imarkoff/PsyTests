import TestHistoryCard from "@/components/Test/TestHistoryCard/TestHistoryCard";
import PatientSection from "@/app/dashboard/doctor/patients/[patientId]/components/PatientSection";
import {Typography} from "@mui/material";
import TestResult from "@/schemas/TestResult";

export default function TestsHistory({tests}: {tests?: TestResult[]}) {
    return (
        <PatientSection title={"Історія проходження тестів"} colSize={400}>
            {tests && tests.map(test => (
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