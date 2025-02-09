import {createContext, useContext} from "react";
import PatientTest from "@/schemas/PatientTest";
import TestResult from "@/schemas/TestResult";
import PassTestData from "@/app/dashboard/patient/tests/[assignedTestId]/schemas/PassTestData";

/**
 * Context for managing test-related data and actions.
 */
const TestContext = createContext<{
    /** The current patient test data. */
    test?: PatientTest;
    /**
     * Function to handle passing the test.
     * @param data - The data to send to the server.
     */
    passTest: (data: PassTestData) => Promise<void>;
    /** The result of the test. */
    result?: TestResult;
}>({
    passTest: async () => {},
});

/** Custom hook to use the TestContext. */
export const useTestContext = () => useContext(TestContext);

export default TestContext;