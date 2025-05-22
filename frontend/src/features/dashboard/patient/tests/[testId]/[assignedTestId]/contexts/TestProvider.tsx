"use client";

import {ReactNode} from "react";
import TestContext from "./TestContext";
import useSWR from "swr";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import {getTestById} from "@/lib/controllers/testController";
import useOnPassTest from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/hooks/useOnPassTest";

interface TestProviderProps {
    testId: string;
    assignedTestId: string;
    children: ReactNode;
}

/**
 * Provides test-related data and actions to its children via context.
 *
 * @param props
 * @param props.testId - The id of the test to pass
 * @param props.assignedTestId - The ID of the assigned test.
 * @param props.children - The child components that will consume the context.
 */
export default function TestProvider({testId, assignedTestId, children}: TestProviderProps) {
    const {
        data: test,
        isLoading: isTestLoading,
        error: swrError
    } = useSWR(
        ["getTestById", testId],
        ([, id]) => withSafeErrorHandling(getTestById)(id),
    );

    const error: string | undefined = swrError ? (
        swrError instanceof Error
            ? swrError.message
            : swrError.toString()
    ) : undefined;

    const { onPass, passed, loading } = useOnPassTest(test, assignedTestId);

    return (
        <TestContext.Provider value={{
            test,
            isTestLoading,
            error,
            passTest: onPass,
            passed,
            loading
        }}>
            {children}
        </TestContext.Provider>
    );
}