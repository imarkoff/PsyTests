"use client";

import TestBase from "@/schemas/TestBase";
import TestsContext from "@/features/dashboard/doctor/tests/contexts/TestsContext";
import {ReactNode, useState} from "react";
import { useRouter } from "next/navigation";

export default function TestsProvider({ tests, children }: { tests: TestBase[], children: ReactNode }) {
    const [selectedTest, setSelectedTest] = useState<TestBase | null>(null);

    const router = useRouter();
    const handleSelectTest = (test: TestBase | null) => {
        router.push(`/dashboard/doctor/tests/${test ? test.id : ""}`);
        setSelectedTest(test);
    }

    return (
      <TestsContext.Provider value={{
          tests,
          selectedTest, setSelectedTest: handleSelectTest
      }}>
          {children}
      </TestsContext.Provider>
    );
}