"use server";

import {fetchProtected} from "@/lib/fetchers";
import AdminService from "@/lib/services/AdminService";
import PaginationParams from "@/types/pagination/PaginationParams";
import User from "@/types/models/User";
import convertPaginationParamsToQuery from "@/utils/convertPaginationParamsToQuery";
import PatientTest from "@/types/models/PatientTest";
import DoctorPatient from "@/types/models/DoctorPatient";

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

export const getDoctorAssignedTests = async (
    doctorId: string,
    paginationParams: PaginationParams<PatientTest>
) => fetchProtected(
    AdminService,
    service => service.getDoctorAssignedTests(
        doctorId,
        convertPaginationParamsToQuery(paginationParams)
    )
);

export const getPatientsByDoctor = async (
    doctorId: string,
    paginationParams: PaginationParams<DoctorPatient>
) => fetchProtected(
    AdminService,
    service => service.getPatientsByDoctor(
        doctorId,
        convertPaginationParamsToQuery(paginationParams)
    )
);