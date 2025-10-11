"use client";

import {createContext, PropsWithChildren} from "react";
import useTestAssignment, {UseTestAssignmentReturn} from "../hooks/useTestAssignment";

export const TestAssignmentContext = createContext<
    UseTestAssignmentReturn | undefined
>(
    undefined
);

interface TestAssignmentProviderProps extends PropsWithChildren {
    testId: string;
    setOpenAction: (open: boolean) => void;
}

export default function TestAssignmentProvider({ testId, setOpenAction, children }: TestAssignmentProviderProps) {
    const testAssignment = useTestAssignment(
        testId,
        setOpenAction,
    );

    return (
        <TestAssignmentContext.Provider value={testAssignment}>
            {children}
        </TestAssignmentContext.Provider>
    );
}