"use client"

import dayjs from "dayjs";
import {Box, NoSsr, Typography} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import useGetPatientsByDoctorAdminApi from "../hooks/lib/useGetPatientsByDoctorAdminApi";
import DoctorPatient from "@/types/models/DoctorPatient";
import NeedsAttentionChip from "@/components/NeedsAttentionChip";

interface PatientsByDoctorDataGridProps {
    doctorId: string | null;
}

const columns: GridColDef<DoctorPatient>[] = [
    {
        field: "patient",
        headerName: "Пацієнт",
        renderCell: ({row}) => (
            `${row.patient.surname} ${row.patient.name} ${row.patient.patronymic ?? ''}`.trim()
        ),
        width: 300
    },
    {
        field: "assigned_at",
        headerName: "Дата ставлення на облік",
        type: "dateTime",
        width: 200,
        headerAlign: "center",
        align: "center",
        valueFormatter: ({value}) => dayjs(value).format("DD.MM.YYYY HH:mm"),
    },
    {
        field: "needs_attention",
        headerName: "Чи потребує уваги",
        description: "Показує, чи потребує пацієнт уваги лікаря (наприклад, після проходження пацієнтом тесту)",
        type: "boolean",
        width: 175,
        headerAlign: "center",
        align: "center",
        renderCell: ({row}) => (
            row.needs_attention ? <NeedsAttentionChip /> : null
        )
    }
]

export default function PatientsByDoctorDataGrid(
    { doctorId } : PatientsByDoctorDataGridProps
) {
    const {
        paginatedPatients,
        isLoading,
        paginationModel,
        setPaginationModel,
        filterModel,
        setFilterModel
    } = useGetPatientsByDoctorAdminApi(doctorId);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Пацієнти, що на обліку у лікаря
            </Typography>
            <NoSsr>
                <DataGrid
                    columns={columns}
                    rows={paginatedPatients?.data ?? []}
                    rowCount={paginatedPatients?.total ?? 0}

                    loading={isLoading}
                    pageSizeOptions={[25, 50, 100]}

                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    paginationMode="server"

                    filterModel={filterModel}
                    onFilterModelChange={setFilterModel}
                    filterMode="server"

                    disableColumnFilter

                    sx={{
                        borderRadius: 0.5
                    }}
                />
            </NoSsr>
        </Box>
    );
}