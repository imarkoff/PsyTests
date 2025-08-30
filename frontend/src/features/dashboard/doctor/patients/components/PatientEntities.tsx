"use client";

import DoctorPatientCard from "@/components/PatientCard/DoctorPatientCard";
import useGetPatientsApi from "@/features/dashboard/doctor/patients/hooks/lib/useGetPatientsApi";
import PatientEntitiesSkeleton from "@/features/dashboard/doctor/patients/components/PatientEntitiesSkeleton";

/** Draws all patients for doctor. */
export default function PatientEntities() {
    const {
        allPatients, normalPatients, needsAttention,
        isLoading, error
    } = useGetPatientsApi();

    return (
        <>
            {needsAttention?.map(patient => (
                <DoctorPatientCard patient={patient} key={patient.id} />
            ))}
            {normalPatients?.map(patient => (
                <DoctorPatientCard patient={patient} key={patient.id} />
            ))}

            <PatientEntitiesSkeleton
                hasPatients={allPatients ? allPatients.length > 0 : false}
                isLoading={isLoading}
                error={error}
            />
        </>
    );
}