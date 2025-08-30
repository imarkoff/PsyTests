import UserCreate from "@/types/forms/UserCreate";
import {createUser} from "@/lib/controllers/adminUsersController";
import useSWRMutation from "swr/mutation";
import User from "@/types/models/User";

export default function useCreateUserApi(
    onSuccess?: (createdUser: User) => void
) {
    const fetcher = async (
        _: string,
        {arg}: { arg: UserCreate; }
    ) => (
        createUser(arg)
    );

    const {
        trigger,
        isMutating,
        data: response
    } = useSWRMutation(
        "admin/users/create",
        fetcher,
        {
            onSuccess: (data) => {
                if (onSuccess && data.success) {
                    onSuccess(data.data!);
                }
            }
        }
    );

    return {
        trigger,
        loading: isMutating,
        error: response?.error?.statusText,
        createdUser: response?.data
    };
}