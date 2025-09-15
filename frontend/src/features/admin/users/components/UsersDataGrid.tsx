"use client";

import {Box, NoSsr} from "@mui/material";
import {DataGrid, DataGridProps, GridRowParams} from "@mui/x-data-grid";
import User from "@/types/models/User";
import PaginatedList from "@/types/pagination/PaginatedList";
import GettingUsersErrorOverlayAlert from "./GettingUsersErrorOverlayAlert";
import UsersGridToolbar from "./UsersGridToolbar";
import usersGridColumns from "../configs/usersGridColumns";
import useUsersContext from "../hooks/useUsersContext";
import useNavigateToUserDetails from "../hooks/useNavigateToUserDetails";

interface UsersDataGridProps extends Pick<
    DataGridProps,
    'filterModel' | 'onFilterModelChange' |
    'sortModel' | 'onSortModelChange' |
    'paginationModel' | 'onPaginationModelChange'
> {
    paginatedUsers: PaginatedList<User> | undefined;
    isLoading: boolean;
    error: string | undefined;
}

export default function UsersDataGrid(
    {
        paginatedUsers, isLoading, error,
        paginationModel, onPaginationModelChange,
        sortModel, onSortModelChange,
        filterModel, onFilterModelChange
    }: UsersDataGridProps
) {
    const {grid: {extendedColumns}} = useUsersContext();
    const navigateToUserDetails = useNavigateToUserDetails();

    const columns = [...usersGridColumns, ...extendedColumns || []];

    const handleRowClick = ({row}: GridRowParams<User>) => {
        navigateToUserDetails(row.id);
    }

    return (
        <NoSsr>
            <Box sx={{position: "relative", height: "100%"}}>
                <DataGrid
                    columns={columns}
                    rows={paginatedUsers?.data || []}

                    pageSizeOptions={[1, 25, 50, 100]}
                    rowCount={paginatedUsers?.total || 0}
                    loading={isLoading}

                    paginationModel={paginationModel}
                    onPaginationModelChange={onPaginationModelChange}
                    paginationMode={"server"}

                    sortModel={sortModel}
                    onSortModelChange={onSortModelChange}
                    sortingMode={"server"}

                    filterModel={filterModel}
                    onFilterModelChange={onFilterModelChange}
                    filterMode={"server"}

                    onRowClick={handleRowClick}

                    slotProps={{
                        loadingOverlay: {
                            variant: 'linear-progress',
                            noRowsVariant: 'skeleton'
                        }
                    }}
                    slots={{toolbar: UsersGridToolbar}}
                    showToolbar
                />
                {error && (
                    <GettingUsersErrorOverlayAlert error={error}/>
                )}
            </Box>
        </NoSsr>
    );
}