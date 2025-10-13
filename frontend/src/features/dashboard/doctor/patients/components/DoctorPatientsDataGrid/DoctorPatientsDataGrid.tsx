"use client";

import { NoSsr } from "@mui/material";
import {DataGrid, DataGridProps} from "@mui/x-data-grid";
import PaginatedList from "@/types/pagination/PaginatedList";
import DoctorPatient from "@/types/models/DoctorPatient";
import {ApiResponseError} from "@/lib/api-client/types";
import columns from "./columns";
import DoctorPatientsToolbar from "./DoctorPatientsToolbar";
import NoDoctorPatientsAlert from "./NoDoctorPatientsAlert";

type DoctorPatientsDataGridProps = {
    paginatedPatients: PaginatedList<DoctorPatient> | undefined;
    onPatientClick: (patient: DoctorPatient) => void;
    error?: ApiResponseError;
} & Required<Pick<
    DataGridProps,
    'loading' |
    'paginationModel' | 'onPaginationModelChange' |
    'sortModel' | 'onSortModelChange' |
    'filterModel' | 'onFilterModelChange'
>>;

export default function DoctorPatientsDataGrid(
    {paginatedPatients, onPatientClick, error, ...props}: DoctorPatientsDataGridProps,
) {
    return (
        <NoSsr>
            <DataGrid
                columns={columns}
                rows={paginatedPatients?.data}
                pageSizeOptions={[25, 50, 100]}
                rowCount={paginatedPatients?.total ?? 0}

                showToolbar
                slots={{
                    toolbar: DoctorPatientsToolbar,
                    noRowsOverlay: () => <NoDoctorPatientsAlert error={error} />
                }}

                paginationMode={"server"}
                filterMode={"server"}
                sortingMode={"server"}

                onRowClick={({row}) => onPatientClick(row)}

                {...props}
            />
        </NoSsr>
    );
}