"use client";

import useSWR from "swr";
import DoctorPatientCard from "@/features/dashboard/doctor/patients/components/PatientCard/DoctorPatientCard";
import { getAllPatients } from "@/lib/controllers/doctorPatientController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";

export default function PatientEntities() {
    const {
        data: patients
    } = useSWR("getAllPatients", withSafeErrorHandling(getAllPatients));
    
    const needsAttention = patients?.filter(patient => patient.needs_attention);
    const normal = patients?.filter(patient => !patient.needs_attention);

    return (
        <>
            {needsAttention?.map(patient => (
                <DoctorPatientCard patient={patient} key={patient.id} />
            ))}
            {normal?.map(patient => (
                <DoctorPatientCard patient={patient} key={patient.id} />
            ))}
        </>
    );
}