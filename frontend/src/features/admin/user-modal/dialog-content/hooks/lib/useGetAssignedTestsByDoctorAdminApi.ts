import useGridPagination from "@/hooks/pagination/mui/useGridPagination";
import PatientTest from "@/types/models/PatientTest";
import useSWR from "swr";
import {ApiResponse} from "@/lib/api-client/types";
import {getDoctorAssignedTests} from "@/lib/controllers/adminController";
import PaginatedList from "@/types/pagination/PaginatedList";
import PaginationFieldSortingDirection from "@/types/enums/PaginationFieldSortingDirection";
import PaginationParams from "@/types/pagination/PaginationParams";

export default function useGetAssignedTestsByDoctorAdminApi(
    doctorId: string | null
) {
    const {
        paginationParams,
        ...paginationHandlers
    } = useGridPagination<PatientTest>({
        sortedFields: [
            { field: 'assigned_at', direction: PaginationFieldSortingDirection.DESC }
        ]
    });

    const fetcher = (
        [doctorId, paginationParams]: [string, PaginationParams<PatientTest>]
    ) => (
        getDoctorAssignedTests(doctorId, paginationParams)
    );

    const {
        data: response,
        isLoading
    } = useSWR<
        ApiResponse<PaginatedList<PatientTest>>
    >(
        doctorId ? [doctorId, paginationParams, "admin/doctor/assigned-tests"] : null,
        fetcher,
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
        }
    );

    return {
        paginatedTests: response?.data ?? null,
        error: response?.error ?? null,
        isLoading,
        ...paginationHandlers
    };
}