import useSWR from "swr";
import {useState} from "react";
import PaginationParams from "@/schemas/PaginationParams";
import {getPatients} from "@/lib/controllers/adminController";
import {ApiResponse} from "@/lib/api-client/types";
import PaginatedList from "@/schemas/PaginatedList";
import User from "@/schemas/User";

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