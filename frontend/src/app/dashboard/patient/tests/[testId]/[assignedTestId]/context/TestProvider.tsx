"use client";

import {ReactNode, useState} from "react";
import TestContext from "./TestContext";
import useSWR from "swr";
import PassTest from "@/schemas/PassTest";
import PassTestData from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/schemas/PassTestData";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";
import {getTestById} from "@/lib/controllers/testController";
import { passTest } from "@/lib/controllers/patientTestController";

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
        data: test
    } = useSWR(
        ["getTestById", testId],
        ([, id]) => withSafeErrorHandling(getTestById)(id),
    );

    const [passed, setPassed] = useState(false);
    const [loading, setLoading] = useState(false);

    /**
     * Function to handle passing the test.
     * @param data
     */
    const onPass = async (data: PassTestData) => {
        if (!test || loading) return;
        setLoading(true);

        try {
            const testData: PassTest = {
                assigned_test_id: assignedTestId,
                // Convert empty strings to null
                answers: Object.keys(data).reduce((acc, pathName) => {
                    acc[pathName] = data[pathName].map(answerId => answerId === "" ? null : answerId);
                    return acc;
                }, {} as PassTest["answers"])
            }

            await passTest(testData);
            setPassed(true);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <TestContext.Provider value={{
            test, passTest: onPass, passed, loading
        }}>
            {children}
        </TestContext.Provider>
    );
}