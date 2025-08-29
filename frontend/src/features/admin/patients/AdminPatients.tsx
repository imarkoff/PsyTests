"use client"

import PatientsDataGrid from "./components/PatientsDataGrid";
import useGetPatientsListApi from "./hooks/lib/useGetPatientsListApi";

export default function AdminPatients() {
    const {
        paginatedPatients,
        isLoading,
        error,
        paginationParams,
        setPaginationParams
    } = useGetPatientsListApi();

    return (
         <PatientsDataGrid
             paginatedPatients={paginatedPatients}
             isLoading={isLoading}
             error={error?.statusText}
             paginationParams={paginationParams}
             setPaginationParams={setPaginationParams}
         />
    );
}