"use client"

import DoctorsDataGrid from "./components/DoctorsDataGrid";
import CreateDoctorDialog from "./components/CreateDoctorDialog";
import useGetDoctorsListApi from "./hooks/lib/useGetDoctorsListApi";

export default function AdminDoctors() {
    const {
        paginatedDoctors,
        isLoading,
        error,
        paginationParams,
        setPaginationParams
    } = useGetDoctorsListApi();

    return (
        <>
            <CreateDoctorDialog />
            <DoctorsDataGrid
                paginatedDoctors={paginatedDoctors}
                isLoading={isLoading}
                error={error?.statusText}
                paginationParams={paginationParams}
                setPaginationParams={setPaginationParams}
            />
        </>

    );
}