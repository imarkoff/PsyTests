"use client";

import useSWR from "swr";
import {getTestMarks} from "@/services/testsService";

export default function useTestMarks(testId: string) {
    const {
        data: marks,
        isLoading,
        error
    } = useSWR(
        `/tests/${testId}/marks`,
        () => getTestMarks(testId),
        { revalidateOnFocus: false }
    );

    return { marks, isLoading, error };
}