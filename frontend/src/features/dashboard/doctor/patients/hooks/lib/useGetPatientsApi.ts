import useSWR from "swr";
import {getAllPatients} from "@/lib/controllers/doctorPatientController";
import {ApiResponse} from "@/lib/api-client/types";
import PaginatedList from "@/types/pagination/PaginatedList";
import DoctorPatient from "@/types/models/DoctorPatient";
import useGridPagination from "@/hooks/pagination/mui/useGridPagination";
import PaginationFieldSortingDirection from "@/types/enums/PaginationFieldSortingDirection";
import useSetTrigger from "@/hooks/trigger/useSetTrigger";

/**
 * Gets all patients from the server.
 * Filters patients into two groups: those who need attention and those who don't.
 * Automatically handles loading and error states.
 */
export default function useGetPatientsApi() {
    const {
        paginationParams,
        ...paginationHandlers
    } = useGridPagination<DoctorPatient>({
        sortedFields: [{
            field: "needs_attention",
            direction: PaginationFieldSortingDirection.DESC
        }]
    });

    const {
        data: response,
        isLoading,
        mutate
    } = useSWR<ApiResponse<PaginatedList<DoctorPatient>>>(
        ["/doctor/patients", paginationParams],
        () => getAllPatients(paginationParams),
        {
            keepPreviousData: true
        }
    );

    useSetTrigger("/doctor/patients", mutate);

    return {
        paginatedPatients: response?.data,
        isLoading,
        error: response?.error,
        paginationHandlers
    };
}