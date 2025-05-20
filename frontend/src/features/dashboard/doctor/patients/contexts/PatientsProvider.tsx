"use client";

import useSWR from "swr";
import PatientsContext from "./PatientsContext";
import {ReactNode} from "react";
import PatientCreate from "@/schemas/PatientCreate";
import {addPatient, createPatient, getAllPatients} from "@/lib/controllers/doctorPatientController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";

export default function PatientsProvider({children}: { children: ReactNode }) {
    const {
        data: patients,
        mutate
    } = useSWR("getAllPatients", withSafeErrorHandling(getAllPatients));

    const onCreate = async (patient: PatientCreate) => {
        const newPatient = await withSafeErrorHandling(createPatient)({
            ...patient,
            phone: Array.from(patient.phone).filter((char: string) => /\d/.test(char)).join("")
        });
        if (newPatient)
            await mutate([newPatient, ...(patients || [])], false);
    }

    const onAdd = async (patientId: string) => {
        const newPatient = await withSafeErrorHandling(addPatient)(patientId);
        if (newPatient)
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