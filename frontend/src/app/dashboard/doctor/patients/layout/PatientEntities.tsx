"use client";

import useSWR from "swr";
import {getPatients} from "@/services/doctorPatientsService";
import PatientCard from "@/components/PatientCard";
import {useRouter} from "next/navigation";
import DoctorPatient from "@/schemas/DoctorPatient";

export default function PatientEntities() {
    const {
        data: patients
    } = useSWR("getPatients", getPatients);

    const router = useRouter();
    const onDetails = (patient: DoctorPatient) =>
        router.push(`${window.location.pathname}/${patient.patient.id}`);


    return (
        patients && patients.map((patient, index) => (
            <PatientCard patient={patient} onClick={onDetails} key={index} />
        ))
    );
}