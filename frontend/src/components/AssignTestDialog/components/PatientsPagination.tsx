"use client"

import {Pagination} from "@mui/material";
import useDoctorPatientsContext from "../hooks/contexts/useDoctorPatientsContext";

export default function PatientsPagination() {
    const {
        paginatedPatients,
        paginationParams: {limit},
        paginationHandlers: {handlePaginationChange}
    } = useDoctorPatientsContext();

    const handlePageChange = (_: unknown, page: number) => {
        handlePaginationChange(page, limit);
    };

    return (
        <Pagination
            count={paginatedPatients?.total_pages}
            page={paginatedPatients ? paginatedPatients.offset + 1 : 1}
            color={"primary"}
            variant={"outlined"}
            onChange={handlePageChange}
        />
    );
}