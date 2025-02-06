"use client";

import {ReactNode, useState} from "react";
import TestContext from "./TestContext";
import {getTest, passTest} from "@/services/patientTestsService";
import useSWR from "swr";
import TestShortResult from "@/schemas/TestShortResult";
import PassTest from "@/schemas/PassTest";

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

    const [result, setResult] = useState<TestShortResult>();
    const [correctAnswers, setCorrectAnswers] = useState<number[]>();

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

        const correctAnswers = responseData.test.questions.map(
            a => a.answers.findIndex(b => b.is_correct));
        setCorrectAnswers(correctAnswers);
    }

    return (
        <TestContext.Provider value={{
            test, passTest: onPass, result, correctAnswers
        }}>
            {children}
        </TestContext.Provider>
    )
}