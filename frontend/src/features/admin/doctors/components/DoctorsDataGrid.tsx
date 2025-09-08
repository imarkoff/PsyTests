import {Box, NoSsr} from "@mui/material";
import {DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";
import User from "@/types/models/User";
import PaginatedList from "@/types/pagination/PaginatedList";
import DoctorsGridToolbar from "./DoctorsGridToolbar";
import GettingDoctorsErrorOverlayAlert from "./GettingDoctorsErrorOverlayAlert";

interface DoctorsDataGridProps {
    paginatedDoctors: PaginatedList<User> | undefined;
    paginationModel: GridPaginationModel;
    setPaginationModel: (params: GridPaginationModel) => void;
    sortModel: GridSortModel;
    onSortModelChange: (newModel: GridSortModel) => void;
    filterModel: GridFilterModel;
    onFilterModelChange: (newModel: GridFilterModel) => void;
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
        valueGetter: (_, row) => row.last_login ? new Date(row.last_login) : null,
    }
];

export default function DoctorsDataGrid(
    {
        paginatedDoctors,
        paginationModel,
        setPaginationModel,
        isLoading,
        error,
        sortModel,
        onSortModelChange,
        filterModel,
        onFilterModelChange
    }: DoctorsDataGridProps
) {
    return (
        <NoSsr>
            <Box sx={{position: "relative", height: "100%" }}>
                <DataGrid
                    columns={columns}
                    rows={paginatedDoctors?.data || []}
                    pageSizeOptions={[1, 25, 50, 100]}
                    loading={isLoading}
                    showToolbar
                    slots={{ toolbar: DoctorsGridToolbar }}
                    rowCount={paginatedDoctors?.total || 0}
                    paginationMode={"server"}
                    sortingMode={"server"}
                    filterMode={"server"}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
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
                    <GettingDoctorsErrorOverlayAlert error={error} />
                )}
            </Box>
        </NoSsr>
    );
}