import useSWR from "swr";
import {getUser} from "@/lib/controllers/userController";

export default function useGetUserByIdApi(
    userId: string
) {
    const {
        data: response,
        isLoading
    } = useSWR(
        ["getUser", userId],
        ([, id]) => getUser(id),
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
        }
    );

    return {
        user: response?.data,
        isLoading,
        error: response?.error
    };
}