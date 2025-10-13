"use client";

import {Box, NoSsr, Typography} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import PatientTest from "@/types/models/PatientTest";
import useGetAssignedTestsByDoctorAdminApi from "../hooks/lib/useGetAssignedTestsByDoctorAdminApi";
import dayjs from "dayjs";
import UserCredentialsChip from "@/components/UserCredentialsChip";

interface AssignedTestsByDoctorDataGridProps {
    doctorId: string;
}

const columns: GridColDef<PatientTest>[] = [
    {
        field: 'test',
        headerName: 'Назва тесту',
        width: 300,
        renderCell: ({row}) => row.test.name
    },
    {
        field: 'patient_id',
        headerName: 'Призначено пацієнту',
        width: 200,
        headerAlign: 'center',
        align: 'center',
        display: 'flex',
        renderCell: ({row}) => (
            <UserCredentialsChip
                userId={row.patient_id}
                format={"compact"}
            />
        )
    },
    {
        field: 'assigned_at',
        headerName: 'Дата призначення',
        width: 200,
        type: "dateTime",
        headerAlign: 'center',
        align: 'center',
        valueFormatter: (_, row) => dayjs(row.assigned_at).format('DD.MM.YYYY HH:mm')
    },
    {
        field: 'unassigned_at',
        headerName: 'Дата зняття',
        width: 200,
        type: "dateTime",
        headerAlign: 'center',
        align: 'center',
        valueFormatter: (_, row) => row.unassigned_at
            ? dayjs(row.unassigned_at).format('DD.MM.YYYY HH:mm')
            : '—'
    }
];

export default function AssignedTestsByDoctorDataGrid(
    {doctorId}: AssignedTestsByDoctorDataGridProps
) {
    const {
        paginatedTests,
        isLoading,
        paginationModel,
        setPaginationModel,
        sortModel,
        setSortModel
    } = useGetAssignedTestsByDoctorAdminApi(doctorId);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Історія призначених тестів
            </Typography>
            <NoSsr>
                <DataGrid
                    columns={columns}
                    rows={paginatedTests?.data ?? []}
                    rowCount={paginatedTests?.total ?? 0}

                    loading={isLoading}

                    pageSizeOptions={[25]}

                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    paginationMode={"server"}

                    sortModel={sortModel}
                    onSortModelChange={setSortModel}
                    sortingMode={"server"}

                    disableColumnFilter

                    sx={{borderRadius: 0.5}}
                />
            </NoSsr>
        </Box>
    );
}