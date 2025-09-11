import useSWR from "swr";
import {getDoctors} from "@/lib/controllers/adminController";
import {ApiResponse} from "@/lib/api-client/types";
import PaginatedList from "@/types/pagination/PaginatedList";
import User from "@/types/models/User";
import useGridPagination from "@/hooks/useGridPagination";
import PaginationFieldSortingDirection from "@/types/enums/PaginationFieldSortingDirection";

export default function useGetDoctorsListApi() {
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
        isLoading
    } = useSWR<ApiResponse<PaginatedList<User>>>(
        ["admin-doctors", paginationParams],
        () => getDoctors(paginationParams),
        { keepPreviousData: true }
    );

    return {
        paginatedDoctors: response?.data,
        isLoading,
        error: response?.error,
        ...paginationHandlers
    };
}