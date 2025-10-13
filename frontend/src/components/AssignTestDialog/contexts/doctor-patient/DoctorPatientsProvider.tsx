"use client";

import {PropsWithChildren} from "react";
import useGetPatientsApi from "../../hooks/lib/useGetPatientsApi";
import DoctorPatientsContext from "./DoctorPatientsContext";

export default function DoctorPatientsProvider({ children }: PropsWithChildren) {
    const getPatientsApi = useGetPatientsApi();

    return (
        <DoctorPatientsContext.Provider value={getPatientsApi}>
            {children}
        </DoctorPatientsContext.Provider>
    );
}