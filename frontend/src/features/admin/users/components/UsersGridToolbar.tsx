"use client";

import DataGridToolbar from "@/components/DataGridToolbar";
import useUsersContext from "../hooks/useUsersContext";
import CreateUserDialog from "../components/CreateUserDialog";

export default function UsersGridToolbar() {
    const {grid: {toolbar}} = useUsersContext();

    return (
        <DataGridToolbar.Root>
            <DataGridToolbar.Title>
                {toolbar.title}
            </DataGridToolbar.Title>
            <DataGridToolbar.Options>
                <DataGridToolbar.Columns/>
                <DataGridToolbar.Filters/>
                <DataGridToolbar.Divider/>
                <DataGridToolbar.Search
                    placeholder={toolbar.searchPlaceholder}
                    sx={{width: {xs: '100%', sm: '300px', md: '400px'}}}
                />
                <DataGridToolbar.Divider/>
                <CreateUserDialog/>
            </DataGridToolbar.Options>
        </DataGridToolbar.Root>
    );
}