"use client";

import useSWR from "swr";
import {getPatients} from "@/services/doctorPatientsService";
import PatientCard from "@/components/PatientCard";
import {useRouter} from "next/navigation";
import User from "@/schemas/User";

export default function PatientEntities() {
    const {
        data: patients
    } = useSWR("getPatients", getPatients);

    const router = useRouter();
    const onDetails = (patient: User) =>
        router.push(`${window.location.pathname}/${patient.id}`);


    return (
        patients && patients.map((patient, index) => (
            <PatientCard patient={patient} onDetails={onDetails} key={index} />
        ))
    );
}