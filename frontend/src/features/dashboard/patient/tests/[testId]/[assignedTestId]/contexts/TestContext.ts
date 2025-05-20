"use client";

import {createContext} from "react";
import PassTestData from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/schemas/PassTestData";
import TestBase from "@/schemas/TestBase";

/**
 * Context for managing test-related data and actions.
 */
const TestContext = createContext<{
    /** The current patient test data. Contains full test info */
    test?: TestBase;
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

export default TestContext;