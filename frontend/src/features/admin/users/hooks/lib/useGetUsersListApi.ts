import useSWR from "swr";
import {ApiResponse} from "@/lib/api-client/types";
import PaginatedList from "@/types/pagination/PaginatedList";
import User from "@/types/models/User";
import useGridPagination from "@/hooks/useGridPagination";
import PaginationFieldSortingDirection from "@/types/enums/PaginationFieldSortingDirection";
import useSetUserTrigger from "@/features/admin/user-modal/hooks/useSetUserTrigger";
import useUsersContext from "../../hooks/useUsersContext";

export default function useGetUsersListApi() {
    const {api: {getUsers}, role} = useUsersContext();

    const {
        paginationParams,
        ...paginationHandlers
    } = useGridPagination<User>({
        sortedFields: [{
            field: "last_login",
            direction: PaginationFieldSortingDirection.ASC
        }]
    });

    const {
        data: response,
        isLoading,
        mutate
    } = useSWR<ApiResponse<PaginatedList<User>>>(
        ["admin", role, paginationParams],
        () => getUsers(paginationParams),
        {keepPreviousData: true}
    );

    useSetUserTrigger(mutate);

    return {
        paginatedUsers: response?.data,
        isLoading,
        error: response?.error,
        ...paginationHandlers
    };
}