import useSWR from "swr";
import {getTest} from "@/services/testsService";

export default function useTest(testId: string) {
    const {
        data: test,
        isLoading,
        error
    } = useSWR(`getTest/${testId}`, () => getTest(testId),
        {revalidateOnFocus: false}
    );

    return { test, isLoading, error }
}