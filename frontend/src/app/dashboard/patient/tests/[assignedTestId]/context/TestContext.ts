import {createContext, useContext} from "react";
import PatientTest from "@/schemas/PatientTest";

const TestContext = createContext<{
    test?: PatientTest;
    getAnswer: (questionId: number) => number;
    setAnswer: (questionId: number, answerId: number) => void;
}>({
    getAnswer: () => 0,
    setAnswer: () => {}
});

export default TestContext;

export const useTestContext = () => useContext(TestContext);