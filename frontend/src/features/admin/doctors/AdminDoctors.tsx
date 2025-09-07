"use client"

import DoctorsDataGrid from "./components/DoctorsDataGrid";
import useGetDoctorsListApi from "./hooks/lib/useGetDoctorsListApi";

export default function AdminDoctors() {
    const {
        paginatedDoctors,
        isLoading,
        error,
        paginationModel,
        setPaginationModel,
        sortModel,
        setSortModel,
        filterModel,
        setFilterModel
    } = useGetDoctorsListApi();

    return (
        <DoctorsDataGrid
            paginatedDoctors={paginatedDoctors}
            isLoading={isLoading}
            error={error?.statusText}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
        />
    );
}