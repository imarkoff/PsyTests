"use client";

import useSWR from "swr";
import PatientsContext from "./PatientsContext";
import {ReactNode} from "react";
import UserCreate from "@/types/forms/UserCreate";
import {addPatient, createPatient, getAllPatients} from "@/lib/controllers/doctorPatientController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";

export default function PatientsProvider({children}: { children: ReactNode }) {
    const {
        data: response,
        mutate
    } = useSWR("getAllPatients", getAllPatients);

    const patients = response?.data;

    const onCreate = async (patient: UserCreate) => {
        const newPatient = await withSafeErrorHandling(createPatient)({
            ...patient,
            phone: Array.from(patient.phone).filter((char: string) => /\d/.test(char)).join("")
        });
        console.log(patients);
        if (newPatient)
            await mutate((prev) => ({
                ...prev ? prev : { success: true },
                data: [newPatient, ...(patients || [])]
            }), false);
    }

    const onAdd = async (patientId: string) => {
        const newPatient = await withSafeErrorHandling(addPatient)(patientId);
        if (newPatient)
            await mutate((prev) => ({
                ...prev ? prev : { success: true },
                data: [newPatient, ...(patients || [])]
            }), false);
    }

    return (
        <PatientsContext.Provider value={{
            patients, createPatient: onCreate, addPatient: onAdd
        }}>
            {children}
        </PatientsContext.Provider>
    );
}