import useSWR from "swr";
import {getUser} from "@/lib/controllers/adminUsersController";
import {ApiResponse, ApiResponseError} from "@/lib/api-client/types";
import User from "@/types/models/User";

interface UseGetUserByAdminApiReturn {
    user: User | null;
    isLoading: boolean;
    error: ApiResponseError | null;
    changeUser: (user: User | null) => void;
}

export default function useGetUserByAdminApi(
    id: string
): UseGetUserByAdminApiReturn {
    const {
        data: response,
        isLoading,
        mutate
    } = useSWR<ApiResponse<User>>(
        ["admin/user", id],
        () => getUser(id)
    );

    const changeUser = (user: User | null) => {
        if (!user) {
            return mutate(undefined);
        }
        return mutate({
            ...response,
            data: user,
            success: response?.success ?? true
        }, false);
    };

    return {
        user: response?.data ?? null,
        isLoading,
        error: response?.error ?? null,
        changeUser
    };
}