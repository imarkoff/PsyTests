import {createContext} from "react";
import {UseGetPatientsApiReturn} from "../../hooks/lib/useGetPatientsApi";

const DoctorPatientsContext = createContext<
    UseGetPatientsApiReturn | undefined
>(
    undefined
);

export default DoctorPatientsContext;