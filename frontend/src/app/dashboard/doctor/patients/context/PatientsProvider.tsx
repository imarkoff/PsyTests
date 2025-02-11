"use client";

import {addPatient, createPatient, getPatients} from "@/services/doctorPatientsService";
import useSWR from "swr";
import PatientsContext from "./PatientsContext";
import {ReactNode} from "react";
import PatientCreate from "@/schemas/PatientCreate";

export default function PatientsProvider({children}: { children: ReactNode }) {
    const {
        data: patients,
        mutate
    } = useSWR("getPatients", getPatients);

    const onCreate = async (patient: PatientCreate) => {
        const newPatient = await createPatient({
            ...patient,
            phone: Array.from(patient.phone).filter((char: string) => /\d/.test(char)).join("")
        });
        await mutate([newPatient, ...(patients || [])], false);
    }

    const onAdd = async (patientId: string) => {
        const newPatient = await addPatient(patientId);
        await mutate([newPatient, ...(patients || [])], false);
    }

    return (
        <PatientsContext.Provider value={{
            patients, createPatient: onCreate, addPatient: onAdd
        }}>
            {children}
        </PatientsContext.Provider>
    );
}