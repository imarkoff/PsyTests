import useSWR from "swr";
import {getTestById} from "@/lib/controllers/testController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";

export default function useTest(testId: string) {
    const {
        data: test,
        isLoading,
        error
    } = useSWR(
        `getTestById/${testId}`,
        withSafeErrorHandling(() => getTestById(testId)),
        {revalidateOnFocus: false}
    );

    return { test, isLoading, error }
}