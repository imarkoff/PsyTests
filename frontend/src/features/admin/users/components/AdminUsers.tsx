"use client";

import UsersDataGrid from "./UsersDataGrid";
import UsersProvider from "../contexts/UsersProvider";
import UserEntityConfig from "../types/UserEntityConfig";
import useGetUsersListApi from "../hooks/lib/useGetUsersListApi";

interface AdminUsersProps {
    config: UserEntityConfig;
}

export default function AdminUsers({config}: AdminUsersProps) {
    return (
        <UsersProvider config={config}>
            <AdminUsersContent />
        </UsersProvider>
    );
}

const AdminUsersContent = () => {
    const {
        paginatedUsers, isLoading, error,
        paginationModel, setPaginationModel,
        sortModel, setSortModel,
        filterModel, setFilterModel
    } = useGetUsersListApi();

    return (
        <UsersDataGrid
            paginatedUsers={paginatedUsers}
            isLoading={isLoading}
            error={error?.statusText}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
        />
    );
}