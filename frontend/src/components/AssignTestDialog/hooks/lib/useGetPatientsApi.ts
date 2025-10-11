import useSWR from "swr";
import {getAllPatients} from "@/lib/controllers/doctorPatientController";
import {ApiResponse, ApiResponseError} from "@/lib/api-client/types";
import PaginatedList from "@/types/pagination/PaginatedList";
import DoctorPatient from "@/types/models/DoctorPatient";
import usePaginationParams, {UsePaginationParamsReturn} from "@/hooks/pagination/usePaginationParams";

export interface UseGetPatientsApiReturn {
    paginatedPatients: PaginatedList<DoctorPatient> | undefined;
    isLoading: boolean;
    error: ApiResponseError | undefined;
    paginationHandlers: Omit<UsePaginationParamsReturn<DoctorPatient>, 'paginationParams'>;
}

export default function useGetPatientsApi(): UseGetPatientsApiReturn {
    const {
        paginationParams,
        ...paginationHandlers
    } = usePaginationParams<DoctorPatient>({
        limit: 10
    });

    const {
        data: response,
        isLoading
    } = useSWR<ApiResponse<PaginatedList<DoctorPatient>>>(
        ["/doctor/patients", paginationParams],
        () => getAllPatients(paginationParams),
        {
            keepPreviousData: true
        }
    );

    return {
        paginatedPatients: response?.data,
        isLoading,
        error: response?.error,
        paginationHandlers
    };
}