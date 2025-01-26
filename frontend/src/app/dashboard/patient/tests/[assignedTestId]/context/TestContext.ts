import {createContext, useContext} from "react";
import PatientTest from "@/schemas/PatientTest";
import TestResult from "@/schemas/TestResult";

/**
 * Context for managing test-related data and actions.
 */
const TestContext = createContext<{
    /** The current patient test data. */
    test?: PatientTest;
    /**
     * Function to handle passing the test.
     * @param data - The answers data where keys are question IDs and values are answer IDs.
     */
    passTest: (data: {[questionId: number]: string}) => Promise<void>;
    /** The result of the test. */
    result?: TestResult;
}>({
    passTest: async () => {},
});

/** Custom hook to use the TestContext. */
export const useTestContext = () => useContext(TestContext);

export default TestContext;