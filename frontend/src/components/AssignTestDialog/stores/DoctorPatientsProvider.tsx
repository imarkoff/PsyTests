"use client";

import {createContext, PropsWithChildren} from "react";
import useGetPatientsApi, {UseGetPatientsApiReturn} from "../hooks/lib/useGetPatientsApi";

export const DoctorPatientsContext = createContext<
    UseGetPatientsApiReturn | undefined
>(
    undefined
);

export default function DoctorPatientsProvider({ children }: PropsWithChildren) {
    const getPatientsApi = useGetPatientsApi();

    return (
        <DoctorPatientsContext.Provider value={getPatientsApi}>
            {children}
        </DoctorPatientsContext.Provider>
    );
}