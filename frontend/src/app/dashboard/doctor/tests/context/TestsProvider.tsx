"use client";

import TestBase from "@/schemas/TestBase";
import TestsContext from "@/app/dashboard/doctor/tests/context/TestsContext";
import {ReactNode, useState} from "react";
import useSWR from "swr";
import {getTests} from "@/services/testsService";
import {useRouter} from "next/navigation";

export default function TestsProvider({ children }: { children: ReactNode }) {
    const {
        data: tests,
        isLoading,
        error
    } = useSWR("getTests", getTests, { revalidateOnFocus: false });

    const [selectedTest, setSelectedTest] = useState<TestBase | null>(null);

    const router = useRouter();
    const handleSelectTest = (test: TestBase | null) => {
        router.push(`/dashboard/doctor/tests/${test ? test.id : ""}`);
        setSelectedTest(test);
    }

    return (
      <TestsContext.Provider value={{
          tests, isLoading, error,
          selectedTest, setSelectedTest: handleSelectTest
      }}>
          {children}
      </TestsContext.Provider>
    );
}