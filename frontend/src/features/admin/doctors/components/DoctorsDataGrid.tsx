import {DataGrid, GridColDef, GridPaginationModel} from "@mui/x-data-grid";
import User from "@/schemas/User";
import PaginationParams from "@/schemas/PaginationParams";
import PaginatedList from "@/schemas/PaginatedList";
import {Alert, AlertTitle, Box, NoSsr} from "@mui/material";

interface DoctorsDataGridProps {
    paginatedDoctors: PaginatedList<User> | undefined;
    paginationParams: PaginationParams;
    setPaginationParams: (params: PaginationParams) => void;
    isLoading: boolean;
    error: string | undefined;
}

const columns: GridColDef<User>[] = [
    {
        field: "fullName",
        headerName: "Лікар",
        width: 200,
        renderCell: (params) =>
            `${params.row.surname} ${params.row.name} ${params.row.patronymic || ''}`,
        sortComparator: (v1, v2) => {
            const fullName1 = `${v1.surname} ${v1.name} ${v1.patronymic || ''}`;
            const fullName2 = `${v2.surname} ${v2.name} ${v2.patronymic || ''}`;
            return fullName1.localeCompare(fullName2);
        }
    },
    {
        field: "phone",
        headerName: "Номер телефону",
        width: 150,
    },
];

export default function DoctorsDataGrid(
    { paginatedDoctors, paginationParams, setPaginationParams, isLoading, error }: DoctorsDataGridProps
) {
    const handlePageChange = (paginationModel: GridPaginationModel) => {
        setPaginationParams({
            offset: paginationModel.page,
            limit: paginationModel.pageSize,
        });
    };

    return (
        <NoSsr>
            <Box sx={{position: "relative", height: "100%" }}>
                <DataGrid
                    columns={columns}
                    rows={paginatedDoctors?.data || []}
                    pageSizeOptions={[25, 50, 100]}
                    loading={isLoading}
                    paginationModel={{
                        page: paginationParams.offset,
                        pageSize: paginationParams.limit,
                    }}
                    onPaginationModelChange={handlePageChange}
                    rowCount={paginatedDoctors?.total || 0}
                    paginationMode={"server"}
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