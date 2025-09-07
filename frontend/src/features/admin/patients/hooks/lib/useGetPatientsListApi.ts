import useSWR from "swr";
import {useState} from "react";
import PaginationParams from "@/types/pagination/PaginationParams";
import {getPatients} from "@/lib/controllers/adminController";
import {ApiResponse} from "@/lib/api-client/types";
import PaginatedList from "@/types/pagination/PaginatedList";
import User from "@/types/models/User";

export default function useGetPatientsListApi() {
    const [paginationParams, setPaginationParams] = useState<PaginationParams>({
        limit: 25,
        offset: 0
    });

    const {
        data: response,
        isLoading
    } = useSWR<ApiResponse<PaginatedList<User>>>(
        ["admin-patients", paginationParams],
        () => getPatients(paginationParams)
    );

    return {
        paginatedPatients: response?.data,
        isLoading,
        error: response?.error,
        paginationParams,
        setPaginationParams
    };
}