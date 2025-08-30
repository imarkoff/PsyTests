import {createContext, useContext} from "react";
import UserCreate from "@/types/forms/UserCreate";
import DoctorPatient from "@/types/models/DoctorPatient";

const PatientsContext = createContext<{
    patients?: DoctorPatient[];
    createPatient: (patient: UserCreate) => Promise<void>
    addPatient: (patientId: string) => Promise<void>;
}>({
    createPatient: async () => {},
    addPatient: async () => {}
});

export const usePatientsContext = () => useContext(PatientsContext);

export default PatientsContext;