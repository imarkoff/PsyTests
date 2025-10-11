import {useContext} from "react";
import {DoctorPatientsContext} from "../stores/DoctorPatientsProvider";
import {OutOfReactContextError} from "@/errors";

export default function useDoctorPatientsContext() {
    const context = useContext(DoctorPatientsContext);

    if (!context) {
        throw new OutOfReactContextError("DoctorPatientsContext has been used out of context");
    }

    return context;
}