import {createContext, useContext} from "react";
import User from "@/schemas/User";
import PatientCreate from "@/schemas/PatientCreate";

const PatientsContext = createContext<{
    patients?: User[];
    createPatient: (patient: PatientCreate) => Promise<void>
    addPatient: (patientId: string) => Promise<void>;
}>({
    createPatient: async () => {},
    addPatient: async () => {}
});

export const usePatientsContext = () => useContext(PatientsContext);

export default PatientsContext;