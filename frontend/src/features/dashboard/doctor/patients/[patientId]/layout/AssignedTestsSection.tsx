"use client";

import PatientSection, {
    PatientSectionNoEntities
} from "@/features/dashboard/doctor/patients/[patientId]/components/PatientSection";
import AssignedTestCard from "@/components/AssignedTestCard/AssignedTestCard";
import useSWR from "swr";
import { getMe } from "@/lib/controllers/userController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import usePatientTests from "@/features/dashboard/doctor/patients/[patientId]/hooks/usePatientTests";
import AssignedTestCardSkeleton from "@/components/AssignedTestCard/AssignedTestCardSkeleton";

export default function AssignedTestsSection({patientId}: {patientId: string}) {
    const { tests, isLoading, onUnassign, error } = usePatientTests(patientId);
    const { data: me } = useSWR("getMe", withSafeErrorHandling(getMe));

    const hasTests = tests ? tests.length > 0 : false;

    return (
        <PatientSection title={"Назначені тести"}>
            {!hasTests && Array.from({ length: 3 }).map((_, index) => (
                <AssignedTestCardSkeleton key={index} isLoading={isLoading} />
            ))}

            {tests?.map(test => (
                <AssignedTestCard
                    key={test.id}
                    test={test}
                    onDelete={me?.id === test.assigned_by_id ? onUnassign : undefined}
                />
            ))}

            {!isLoading && !hasTests && (
                <PatientSectionNoEntities title={error
                    ? "Виникла помилка при завантаженні тестів"
                    : "Немає назначених тестів"
                } />
            )}
        </PatientSection>
    );
}