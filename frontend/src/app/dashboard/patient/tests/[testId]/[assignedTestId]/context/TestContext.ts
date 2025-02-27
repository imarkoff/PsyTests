import {createContext, useContext} from "react";
import PassTestData from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/schemas/PassTestData";
import Test from "@/schemas/Test";

/**
 * Context for managing test-related data and actions.
 */
const TestContext = createContext<{
    /** The current patient test data. */
    test?: Test;
    /**
     * Function to handle passing the test.
     * @param data - The data to send to the server.
     */
    passTest: (data: PassTestData) => Promise<void>;
    passed: boolean;
    loading: boolean;
}>({
    passTest: async () => {},
    passed: false,
    loading: false,
});

/** Custom hook to use the TestContext. */
export const useTestContext = () => useContext(TestContext);

export default TestContext;