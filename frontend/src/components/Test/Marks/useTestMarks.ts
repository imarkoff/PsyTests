"use client";

import useSWR from "swr";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import {getTestMarks} from "@/lib/controllers/testController";

export default function useTestMarks(testId: string) {
    const {
        data: marks,
        isLoading,
        error
    } = useSWR(
        `/tests/${testId}/marks`,
        withSafeErrorHandling(() => getTestMarks(testId)),
        { revalidateOnFocus: false }
    );

    return { marks, isLoading, error };
}