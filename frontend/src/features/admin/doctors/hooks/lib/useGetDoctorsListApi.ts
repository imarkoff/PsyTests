import useSWR from "swr";
import {useState} from "react";
import PaginationParams from "@/types/PaginationParams";
import {getDoctors} from "@/lib/controllers/adminController";
import {ApiResponse} from "@/lib/api-client/types";
import PaginatedList from "@/types/PaginatedList";
import User from "@/types/models/User";

export default function useGetDoctorsListApi() {
    const [paginationParams, setPaginationParams] = useState<PaginationParams>({
        limit: 25,
        offset: 0
    });

    const {
        data: response,
        isLoading
    } = useSWR<ApiResponse<PaginatedList<User>>>(
        ["admin-doctors", paginationParams],
        () => getDoctors(paginationParams)
    );

    return {
        paginatedDoctors: response?.data,
        isLoading,
        error: response?.error,
        paginationParams,
        setPaginationParams
    };
}