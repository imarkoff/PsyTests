import {DataGrid, GridColDef, GridPaginationModel, GridSortModel, GridFilterModel} from "@mui/x-data-grid";
import {Alert, AlertTitle, Box, NoSsr} from "@mui/material";
import User from "@/types/models/User";
import PaginatedList from "@/types/pagination/PaginatedList";
import DataGridToolbar from "@/components/DataGridToolbar";
import CreateDoctorDialog from "./CreateDoctorDialog";

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
                    slots={{ toolbar: GridToolbar }}
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
                />
                {error && (
                    <Alert
                        severity={"error"}
                        sx={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                    >
                        <AlertTitle>Сталася помилка</AlertTitle>
                        {error}
                    </Alert>
                )}
            </Box>
        </NoSsr>
    );
}

const GridToolbar = () => {
    return (
        <DataGridToolbar.Root>
            <DataGridToolbar.Title>
                Лікарі, зареєстровані в системі
            </DataGridToolbar.Title>
            <DataGridToolbar.Options>
                <DataGridToolbar.Columns />
                <DataGridToolbar.Filters />
                <DataGridToolbar.Export />
                <DataGridToolbar.Divider />
                <DataGridToolbar.Search
                    placeholder={"Пошук за П.І.Б. або номером телефону"}
                    sx={{ width: {xs: '100%', sm: '300px', md: '400px'} }}
                />
                <DataGridToolbar.Divider />
                <CreateDoctorDialog />
            </DataGridToolbar.Options>
        </DataGridToolbar.Root>
    );
}