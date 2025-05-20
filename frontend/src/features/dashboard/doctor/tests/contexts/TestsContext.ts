"use client";

import {createContext, useContext} from "react";
import TestBase from "@/schemas/TestBase";

const TestsContext = createContext<{
    tests: TestBase[] | undefined;
    selectedTest: TestBase | null;
    setSelectedTest: (test: TestBase | null) => void;
}>({
    tests: undefined,
    selectedTest: null,
    setSelectedTest: () => {}
});

export default TestsContext;

export const useTestsContext = () => useContext(TestsContext);