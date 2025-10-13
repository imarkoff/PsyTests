"use client";

import {PropsWithChildren} from "react";
import useTestAssignment from "../../hooks/useTestAssignment";
import TestAssignmentContext from "./TestAssignmentContext";

interface TestAssignmentProviderProps extends PropsWithChildren {
    testId: string;
    setOpenAction: (open: boolean) => void;
}

export default function TestAssignmentProvider(
    { testId, setOpenAction, children }: TestAssignmentProviderProps
) {
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