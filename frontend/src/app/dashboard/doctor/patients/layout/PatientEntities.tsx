"use client";

import useSWR from "swr";
import {getPatients} from "@/services/doctorPatientsService";
import DoctorPatientCard from "@/app/dashboard/doctor/patients/components/DoctorPatientCard";

export default function PatientEntities() {
    const {
        data: patients
    } = useSWR("getPatients", getPatients);
    
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