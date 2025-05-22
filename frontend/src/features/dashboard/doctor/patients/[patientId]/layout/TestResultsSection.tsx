"use client";

import TestHistoryCard from "@/components/TestHistoryCard/TestHistoryCard";
import PatientSection, {
    PatientSectionNoEntities
} from "@/features/dashboard/doctor/patients/[patientId]/components/PatientSection";
import TestHistoryCardSkeleton from "@/components/TestHistoryCard/TestHistoryCardSkeleton";
import useTestResults from "@/features/dashboard/doctor/patients/[patientId]/hooks/useTestResults";
import useReadPatient from "@/features/dashboard/doctor/patients/[patientId]/hooks/useReadPatient";
import DoctorPatient from "@/schemas/DoctorPatient";

interface TestResultsSectionProps {
    patientId: string;
    doctorPatient: DoctorPatient | undefined;
    readPatientAction: () => Promise<void>;
}

export default function TestResultsSection(
    {patientId, doctorPatient, readPatientAction}: TestResultsSectionProps,
) {
    const { testResults: results, isLoading } = useTestResults(patientId);
    useReadPatient(doctorPatient, results, readPatientAction);

    const hasResults = results ? results.length > 0 : false;

    return (
        <PatientSection title={"Історія проходження тестів"} colSize={400}>
            {!hasResults && Array.from({ length: 8 }).map((_, index) => (
                <TestHistoryCardSkeleton key={index} isLoading={isLoading} />
            ))}

            {results?.map(test => (
                <TestHistoryCard test={test} key={test.id} />
            ))}

            {!isLoading && !hasResults && (
                <PatientSectionNoEntities title={"Історія проходження тестів відсутня"} />
            )}
        </PatientSection>
    );
}