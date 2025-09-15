import {ApiResponse} from "@/lib/api-client/types";
import PaginatedList from "@/types/pagination/PaginatedList";
import User from "@/types/models/User";
import PaginationParams from "@/types/pagination/PaginationParams";
import UserCreate from "@/types/forms/UserCreate";
import {GridColDef} from "@mui/x-data-grid";
import {Roles} from "@/types/enums/Role";

export default interface UserEntityConfig {
    api: {
        getUsers: (paginationParams: PaginationParams<User>) => Promise<ApiResponse<PaginatedList<User>>>;
        createUser: (data: UserCreate) => Promise<ApiResponse<User>>;
    };
    grid: {
        extendedColumns?: GridColDef<User>[];
        toolbar: {
            title: string;
            searchPlaceholder: string;
            createButtonText: string;
        };
    };
    routing: {
        basePath: string;
        detailPath: (id: string) => string;
    };
    role: Roles;
}