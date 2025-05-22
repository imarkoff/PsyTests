"use client";

import DoctorPatientCard from "@/components/PatientCard/DoctorPatientCard";
import useGetPatients from "@/features/dashboard/doctor/patients/hooks/useGetPatients";
import PatientEntitiesSkeleton from "@/features/dashboard/doctor/patients/components/PatientEntitiesSkeleton";

/** Draws all patients for doctor. */
export default function PatientEntities() {
    const {
        allPatients, normalPatients, needsAttention,
        isLoading, error
    } = useGetPatients();

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