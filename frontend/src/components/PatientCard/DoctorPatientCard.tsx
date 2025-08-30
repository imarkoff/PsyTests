"use client";

import DoctorPatient from "@/types/models/DoctorPatient";
import PatientCard from "@/components/PatientCard/PatientCard";
import {useRouter} from "next/navigation";
import User from "@/types/models/User";

export default function DoctorPatientCard({patient}: {patient: DoctorPatient}) {
    const router = useRouter();
    const onDetails = (patient: User) =>
        router.push(`/dashboard/doctor/patients/${patient.id}`);

    return (
        <PatientCard
            patient={patient.patient}
            needsAttention={patient.needs_attention}
            onClick={onDetails}
        />
    );
}