import useSWR from "swr";
import {getPatients} from "@/lib/controllers/adminController";
import {ApiResponse} from "@/lib/api-client/types";
import PaginatedList from "@/types/pagination/PaginatedList";
import User from "@/types/models/User";
import useGridPagination from "@/hooks/useGridPagination";
import PaginationFieldSortingDirection from "@/types/enums/PaginationFieldSortingDirection";
import useSetUserTrigger from "@/features/admin/user-modal/hooks/useSetUserTrigger";

export default function useGetPatientsListApi() {
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
        ["admin-patients", paginationParams],
        () => getPatients(paginationParams),
        { keepPreviousData: true }
    );

    useSetUserTrigger(mutate);

    return {
        paginatedPatients: response?.data,
        isLoading,
        error: response?.error,
        ...paginationHandlers
    };
}