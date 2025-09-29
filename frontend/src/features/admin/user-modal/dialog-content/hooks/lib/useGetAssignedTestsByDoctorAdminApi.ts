import useGridPagination from "@/hooks/pagination/mui/useGridPagination";
import PatientTest from "@/types/models/PatientTest";
import useSWR from "swr";
import {ApiResponse} from "@/lib/api-client/types";
import {getDoctorAssignedTests} from "@/lib/controllers/adminController";
import PaginatedList from "@/types/pagination/PaginatedList";
import PaginationFieldSortingDirection from "@/types/enums/PaginationFieldSortingDirection";

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

    const fetcher = () => {
        if (doctorId) {
            return getDoctorAssignedTests(doctorId, paginationParams);
        }
    };

    const {
        data: response,
        isLoading
    } = useSWR<
        ApiResponse<PaginatedList<PatientTest>>
    >(
        ["admin/doctor/assigned-tests", doctorId, paginationParams],
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