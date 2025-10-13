"use client";

import {ReactNode} from "react";
import PassTestContext from "./PassTestContext";
import useOnPassTest from "../hooks/useOnPassTest";
import {usePsyTestContext} from "@/features/shared/psy-test-viewer";

interface TestProviderProps {
    assignedTestId: string;
    children: ReactNode;
}

/**
 * Provides test-related data and actions to its children via context.
 *
 * @param props
 * @param props.assignedTestId - The ID of the assigned test.
 * @param props.children - The child components that will consume the context.
 */
export default function PassTestProvider({assignedTestId, children}: TestProviderProps) {
    const {test} = usePsyTestContext();
    const { onPass, passed, loading } = useOnPassTest(test, assignedTestId);

    return (
        <PassTestContext.Provider value={{
            passTest: onPass,
            passed,
            loading
        }}>
            {children}
        </PassTestContext.Provider>
    );
}