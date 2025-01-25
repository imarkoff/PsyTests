"use client";

import {ReactNode, useState} from "react";
import TestContext from "./TestContext";
import {getTest} from "@/services/patientTestsService";
import useSWR from "swr";

export type AssignedTestIdParams = Promise<{ assignedTestId: string }>

export default function TestProvider({params, children}: { params: AssignedTestIdParams, children: ReactNode }) {
    const {
        data: test
    } = useSWR(getTest.name, async () => getTest((await params).assignedTestId));

    const [chosenAnswers, setChosenAnswers] = useState<{ [questionId: number]: number }>({});

    const getAnswer = (questionId: number) => chosenAnswers[questionId];

    const setAnswer = (questionId: number, answerId: number) => {
        setChosenAnswers(prev => ({...prev, [questionId]: answerId}));
    }

    return (
        <TestContext.Provider value={{
            test, getAnswer, setAnswer
        }}>
            {children}
        </TestContext.Provider>
    )
}