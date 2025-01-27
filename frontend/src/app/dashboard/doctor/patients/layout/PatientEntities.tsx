"use client";

import useSWR from "swr";
import {getPatients} from "@/services/doctorPatientsService";
import PatientCard from "@/app/dashboard/doctor/patients/components/PatientCard";

export default function PatientEntities() {
    const {
        data: patients
    } = useSWR(getPatients.name, getPatients);

    return (
        patients?.map((patient, index) => (
            <PatientCard patient={patient} key={index} />
        ))
    );
}