"use client"

import DoctorsDataGrid from "./components/DoctorsDataGrid";
import useGetDoctorsListApi from "./hooks/lib/useGetDoctorsListApi";
import {useRouter} from "next/navigation";

export default function AdminDoctors() {
    const router = useRouter();
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

    const handleDoctorClick = (doctorId: string) => {
        router.push(`/dashboard/admin/doctors/${doctorId}`);
    };

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
            onDoctorClick={handleDoctorClick}
        />
    );
}