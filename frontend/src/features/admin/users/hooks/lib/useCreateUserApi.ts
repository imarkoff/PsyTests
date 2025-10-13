import UserCreate from "@/types/forms/UserCreate";
import useSWRMutation from "swr/mutation";
import User from "@/types/models/User";
import useUsersContext from "../../hooks/useUsersContext";
import {ApiResponse} from "@/lib/api-client/types";

export default function useCreateUserApi(
    onSuccess?: (createdUser: User) => void
) {
    const {api: {createUser}} = useUsersContext();

    const fetcher = async (
        _: string,
        {arg}: { arg: UserCreate; }
    ) => (
        createUser(arg)
    );

    const handleSuccess = (data: ApiResponse<User>) => {
        if (onSuccess && data.success) {
            onSuccess(data.data!);
        }
    }

    const {
        trigger,
        isMutating,
        data: response
    } = useSWRMutation(
        "admin/users/create",
        fetcher,
        { onSuccess: handleSuccess }
    );

    return {
        createUser: trigger,
        loading: isMutating,
        error: response?.error?.statusText,
        createdUser: response?.data
    };
}