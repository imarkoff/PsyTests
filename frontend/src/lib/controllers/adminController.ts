"use server";

import {fetchProtected} from "@/lib/fetchers";
import AdminService from "@/lib/services/AdminService";
import PaginationParams from "@/types/pagination/PaginationParams";
import User from "@/types/models/User";
import convertPaginationParamsToQuery from "@/utils/convertPaginationParamsToQuery";

export const getDoctors = async (
    paginationParams: PaginationParams<User>,
) => fetchProtected(
    AdminService,
    service => service.getDoctors(
        convertPaginationParamsToQuery(paginationParams)
    )
);

export const getPatients = async (
    paginationParams: PaginationParams<User>
) => fetchProtected(
    AdminService,
    service => service.getPatients(
        convertPaginationParamsToQuery(paginationParams)
    )
);