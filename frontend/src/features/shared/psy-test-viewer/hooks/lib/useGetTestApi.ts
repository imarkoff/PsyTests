import useSWR from "swr";
import {getTestById} from "@/lib/controllers/testController";
import TestBase from "@/types/models/TestBase";
import {ApiResponseError} from "@/lib/api-client/types";

export interface UseGetTestApiReturn {
    test: TestBase | undefined;
    error: ApiResponseError | undefined;
    isLoading: boolean;
}

export default function useGetTestApi(testId: string): UseGetTestApiReturn {
    const {
        data: response,
        isLoading,
    } = useSWR(
        ["getTestById", testId],
        ([, id]) => getTestById(id),
        {revalidateOnFocus: false}
    );

    return {
        test: response?.data,
        error: response?.error,
        isLoading,
    };
}