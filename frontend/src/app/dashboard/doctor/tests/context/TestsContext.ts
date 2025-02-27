import {createContext, useContext} from "react";
import TestBase from "@/schemas/TestBase";
import {AxiosError} from "axios";

const TestsContext = createContext<{
    tests: TestBase[] | undefined;
    isLoading: boolean;
    error: AxiosError | undefined;
    selectedTest: TestBase | null;
    setSelectedTest: (test: TestBase | null) => void;
}>({
    tests: undefined,
    isLoading: true,
    error: undefined,
    selectedTest: null,
    setSelectedTest: () => {}
});

export default TestsContext;

export const useTestsContext = () => useContext(TestsContext);