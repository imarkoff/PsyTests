import useSWR from "swr";
import {useState} from "react";
import PaginationParams from "@/schemas/PaginationParams";
import {getDoctors} from "@/lib/controllers/adminController";
import {ApiResponse} from "@/lib/api-client/types";
import PaginatedList from "@/schemas/PaginatedList";
import User from "@/schemas/User";

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