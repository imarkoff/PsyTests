"use client";

import PatientsDataGrid from "./components/PatientsDataGrid";
import useGetPatientsListApi from "./hooks/lib/useGetPatientsListApi";
import {useRouter} from "next/navigation";

export default function AdminPatients() {
    const router = useRouter();

    const {
        paginatedPatients,
        isLoading,
        error,
        paginationModel,
        setPaginationModel,
        sortModel,
        setSortModel,
        filterModel,
        setFilterModel
    } = useGetPatientsListApi();

    const handlePatientClick = (patientId: string) => {
        router.push(`/dashboard/admin/patients/${patientId}`);
    }

    return (
        <>
            <PatientsDataGrid
                paginatedPatients={paginatedPatients}
                isLoading={isLoading}
                error={error?.statusText}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}
                onPatientClick={handlePatientClick}
            />
        </>
    );
}