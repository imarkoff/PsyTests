"use client";

import {ReactNode, useState} from "react";
import TestContext from "./TestContext";
import {getTest, passTest} from "@/services/patientTestsService";
import useSWR from "swr";
import TestResult from "@/schemas/TestResult";
import PassTest from "@/schemas/PassTest";
import PassTestData from "@/app/dashboard/patient/tests/[assignedTestId]/schemas/PassTestData";

/**
 * Provides test-related data and actions to its children via context.
 *
 * @param props
 * @param props.assignedTestId - The ID of the assigned test.
 * @param props.children - The child components that will consume the context.
 */
export default function TestProvider({assignedTestId, children}: { assignedTestId: string, children: ReactNode }) {
    const {
        data: test
    } = useSWR(
        `${getTest.name}/${assignedTestId}`,
        () => getTest(assignedTestId)
    );

    const [result, setResult] = useState<TestResult>();

    /**
     * Function to handle passing the test.
     * @param data
     */
    const onPass = async (data: PassTestData) => {
        if (!test || result) return;

        const testData: PassTest = {
            assigned_test_id: test.id,
            // Convert empty strings to null
            answers: Object.keys(data).reduce((acc, pathName) => {
                acc[pathName] = data[pathName].map(answerId => answerId === "" ? null : answerId);
                return acc;
            }, {} as PassTest["answers"])
        }

        const responseData = await passTest(testData);
        setResult(responseData);
    }

    return (
        <TestContext.Provider value={{
            test, passTest: onPass, result
        }}>
            {children}
        </TestContext.Provider>
    )
}