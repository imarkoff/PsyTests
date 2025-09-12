import UserUpdate from "@/types/forms/UserUpdate";
import {updateUser} from "@/lib/controllers/adminUsersController";
import useSWRMutation from "swr/mutation";
import {ApiResponse} from "@/lib/api-client/types";
import User from "@/types/models/User";

export default function usePutUserInfoApi() {
    const fetcher = async (
        _: string,
        {arg: {id, userUpdate}}: {
            arg: {
                id: string;
                userUpdate: UserUpdate;
            }
        }
    ) => {
        const convertedBirthDate = userUpdate.birth_date.toISODate();
        if (!convertedBirthDate) {
            throw new Error("Невірний формат дати народження.");
        }

        const userUpdateDto = {
            ...userUpdate,
            birth_date: convertedBirthDate,
        }

        return await updateUser(id, userUpdateDto);
    };

    const {
        trigger,
        data: response,
        error,
        isMutating,
    } = useSWRMutation<
        ApiResponse<User>,
        Error,
        string,
        {id: string; userUpdate: UserUpdate}
    >(
        "admin/user/update",
        fetcher,
    );

    const handlePutUserInfo = (
        id: string,
        userUpdate: UserUpdate
    ) => (
        trigger({id, userUpdate})
    );

    return {
        handlePutUserInfo,
        response,
        error: error || response?.error,
        isMutating,
    };
}