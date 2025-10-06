import {deleteUser} from "@/lib/controllers/adminUsersController";
import useSWRMutation from "swr/mutation";
import {ApiResponse} from "@/lib/api-client/types";

export default function useDeleteUserByAdminApi() {
    const fetcher = async (
        _: string,
        {arg: {userId}}: { arg: { userId: string } },
    ): Promise<ApiResponse<void>> => (
        deleteUser(userId)
    );

    const {
        trigger,
        data: response,
        isMutating,
    } = useSWRMutation(
        "/admin/users/:userId",
        fetcher,
    );

    const deleteUserByAdmin = async (userId: string) => {
        return trigger({userId});
    };

    return {
        deleteUserByAdmin,
        isMutating,
        error: response?.error,
    };
}