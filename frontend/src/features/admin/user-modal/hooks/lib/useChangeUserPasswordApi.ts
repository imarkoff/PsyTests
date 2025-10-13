import {changeUserPassword} from "@/lib/controllers/adminUsersController";
import useSWRMutation from "swr/mutation";
import {ApiResponse} from "@/lib/api-client/types";

export default function useChangeUserPasswordApi() {
    const fetcher = async (
        _: string,
        {arg: {userId, newPassword}}: { arg: { userId: string, newPassword: string } }
    ) => (
        changeUserPassword(userId, newPassword)
    );

    const {
        data: response,
        trigger,
        isMutating,
        reset
    } = useSWRMutation(
        "/admin/users/password",
        fetcher
    );

    const handleChangeUserPassword = (
        userId: string,
        newPassword: string
    ): Promise<ApiResponse<void>> => {
        return trigger({ userId, newPassword });
    };

    return {
        handleChangeUserPassword,
        isMutating,
        response,
        reset
    };
}