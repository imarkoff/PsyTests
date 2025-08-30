import {createContext, useContext} from "react";
import PatientCreate from "@/types/forms/PatientCreate";
import DoctorPatient from "@/types/models/DoctorPatient";

const PatientsContext = createContext<{
    patients?: DoctorPatient[];
    createPatient: (patient: PatientCreate) => Promise<void>
    addPatient: (patientId: string) => Promise<void>;
}>({
    createPatient: async () => {},
    addPatient: async () => {}
});

export const usePatientsContext = () => useContext(PatientsContext);

export default PatientsContext;