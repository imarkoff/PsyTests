import {useContext} from "react";
import DoctorPatientsContext from "@/components/AssignTestDialog/contexts/doctor-patient/DoctorPatientsContext";
import {OutOfReactContextError} from "@/errors";

export default function useDoctorPatientsContext() {
    const context = useContext(DoctorPatientsContext);

    if (!context) {
        throw new OutOfReactContextError("DoctorPatientsContext has been used out of context");
    }

    return context;
}