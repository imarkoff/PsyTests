import useSWR from "swr";
import DoctorPatient from "@/types/models/DoctorPatient";
import PaginationParams from "@/types/pagination/PaginationParams";
import {getPatientsByDoctor} from "@/lib/controllers/adminController";
import {ApiResponse} from "@/lib/api-client/types";
import useGridPagination from "@/hooks/pagination/mui/useGridPagination";
import PaginatedList from "@/types/pagination/PaginatedList";

export default function useGetPatientsByDoctorAdminApi(
    doctorId: string | null
) {
    const {
        paginationParams,
        ...paginationHandlers
    } = useGridPagination<DoctorPatient>();

    const fetcher = (
        [doctorId, paginationParams]: [string, PaginationParams<DoctorPatient>]
    ) => (
        getPatientsByDoctor(doctorId, paginationParams)
    );

    const shouldFetch = doctorId !== null;

    const {
        data: response,
        isLoading
    } = useSWR<
        ApiResponse<PaginatedList<DoctorPatient>>
    >(
        shouldFetch ? [doctorId, paginationParams, "admin/doctor/patients"] : null,
        fetcher,
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
        }
    );

    return {
        paginatedPatients: response?.data ?? null,
        error: response?.error ?? null,
        isLoading,
        ...paginationHandlers
    }
}