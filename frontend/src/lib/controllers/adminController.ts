"use server";

import {fetchProtected} from "@/lib/fetchers";
import AdminService from "@/lib/services/AdminService";
import PaginationParams from "@/types/PaginationParams";

export const getDoctors = async (
    paginationParams: PaginationParams
) => fetchProtected(
    AdminService,
    service => service.getDoctors(paginationParams)
)

export const getPatients = async (
    paginationParams: PaginationParams
) => fetchProtected(
    AdminService,
    service => service.getPatients(paginationParams)
)