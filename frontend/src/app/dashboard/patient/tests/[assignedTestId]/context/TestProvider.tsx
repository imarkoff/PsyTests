"use client";

import {ReactNode, useState} from "react";
import TestContext from "./TestContext";
import {getTest, passTest} from "@/services/patientTestsService";
import useSWR from "swr";
import TestResult from "@/schemas/TestResult";
import PassTest from "@/schemas/PassTest";

export type AssignedTestIdParams = Promise<{ assignedTestId: string }>

/**
 * Provides test-related data and actions to its children via context.
 *
 * @param props
 * @param props.params - The parameters containing the assigned test ID.
 * @param props.children - The child components that will consume the context.
 */
export default function TestProvider({params, children}: { params: AssignedTestIdParams, children: ReactNode }) {
    const {
        data: test
    } = useSWR(getTest.name, async () => getTest((await params).assignedTestId));

    const [result, setResult] = useState<TestResult>();

    /**
     * Function to handle passing the test.
     * @param data - The answers data where keys are question IDs and values are answer IDs.
     */
    const onPass = async (data: {[questionId: number]: string}) => {
        if (!test || result) return;

        const testData: PassTest = {
            assigned_test_id: test.id,
            answers: Object.values(data).map(answerId => parseInt(answerId)),
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