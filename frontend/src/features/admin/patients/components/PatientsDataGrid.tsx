import {Box, NoSsr} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridFilterModel,
    GridPaginationModel,
    GridRowParams,
    GridSortModel
} from "@mui/x-data-grid";
import User from "@/types/models/User";
import PaginatedList from "@/types/pagination/PaginatedList";
import dayjs from "dayjs";
import PatientsGridToolbar from "./PatientsGridToolbar";
import GettingPatientsErrorOverlayAlert from "./GettingPatientsErrorOverlayAlert";

interface PatientsDataGridProps {
    paginatedPatients: PaginatedList<User> | undefined;
    paginationModel: GridPaginationModel;
    setPaginationModel: (params: GridPaginationModel) => void;
    sortModel: GridSortModel;
    onSortModelChange: (newModel: GridSortModel) => void;
    filterModel: GridFilterModel;
    onFilterModelChange: (newModel: GridFilterModel) => void;
    onPatientClick: (patientId: string) => void;
    isLoading: boolean;
    error: string | undefined;
}

const columns: GridColDef<User>[] = [
    {
        field: "surname",
        headerName: "Прізвище",
        width: 150,
    },
    {
        field: "name",
        headerName: "Ім'я",
        width: 150,
    },
    {
        field: "patronymic",
        headerName: "По батькові",
        width: 150,
    },
    {
        field: "phone",
        headerName: "Номер телефону",
        width: 150,
    },
    {
        field: "last_login",
        headerName: "Останній вхід",
        width: 200,
        type: "dateTime",
        valueFormatter: (_, row) => row.last_login
            ? dayjs(row.last_login).format("DD.MM.YYYY HH:mm")
            : null,
    },
    {
        field: "registered_by",
        headerName: "Ким зареєстрований",
        width: 300,
    },
    {
        field: "registered_at",
        headerName: "Дата реєстрації",
        width: 200,
        type: "dateTime",
        valueFormatter: (_, row) => row.registered_at
            ? dayjs(row.registered_at).format("DD.MM.YYYY HH:mm")
            : null,
    }
];

export default function PatientsDataGrid(
    {
        paginatedPatients,
        paginationModel,
        setPaginationModel,
        isLoading,
        error,
        sortModel,
        onSortModelChange,
        filterModel,
        onFilterModelChange,
        onPatientClick
    }: PatientsDataGridProps
) {
    const handleRowClick = ({row}: GridRowParams<User>) => {
        onPatientClick(row.id);
    }

    return (
        <NoSsr>
            <Box sx={{position: "relative", height: "100%" }}>
                <DataGrid
                    columns={columns}
                    rows={paginatedPatients?.data || []}
                    pageSizeOptions={[1, 25, 50, 100]}
                    loading={isLoading}
                    showToolbar
                    slots={{ toolbar: PatientsGridToolbar }}
                    rowCount={paginatedPatients?.total || 0}
                    paginationMode={"server"}
                    sortingMode={"server"}
                    filterMode={"server"}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    onRowClick={handleRowClick}
                    sortModel={sortModel}
                    onSortModelChange={onSortModelChange}
                    filterModel={filterModel}
                    onFilterModelChange={onFilterModelChange}
                    slotProps={{
                        loadingOverlay: {
                            variant: 'linear-progress',
                            noRowsVariant: 'skeleton'
                        }
                    }}
                />
                {error && (
                    <GettingPatientsErrorOverlayAlert error={error} />
                )}
            </Box>
        </NoSsr>
    );
}