"use client";

import TestBase from "@/types/models/TestBase";
import TestsContext from "@/features/shared/psy-test-catalog/contexts/TestsContext";
import {ReactNode, useState} from "react";
import { useRouter } from "next/navigation";

interface TestsProviderProps {
    tests: TestBase[];
    testRoute: (testId: string) => string;
    children: ReactNode;
}

export default function TestsProvider({ tests, children, testRoute }: TestsProviderProps) {
    const [selectedTest, setSelectedTest] = useState<TestBase | null>(null);
    const router = useRouter();

    const handleSelectTest = (test: TestBase | null) => {
        if (test === null) return;
        router.push(testRoute(test.id));
        setSelectedTest(test);
    }

    return (
      <TestsContext.Provider value={{
          tests,
          selectedTest,
          setSelectedTest: handleSelectTest
      }}>
          {children}
      </TestsContext.Provider>
    );
}