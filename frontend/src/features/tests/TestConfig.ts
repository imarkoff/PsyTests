import TestBase from "@/schemas/TestBase";
import TestResult from "@/schemas/TestResult";
import { ComponentType } from "react";
import TestInfoType from "@/features/tests/TestInfoType";

/**
 * Configuration of a test components.
 */
export default interface TestConfigType<
    TTest extends TestBase,
    TTestResult extends TestResult<object | null>
> {
    test: {
        header: ComponentType<TestInfoType<TTest>>;
        content: ComponentType<TestInfoType<TTest>>;
        marks?: ComponentType<TestInfoType<TTest>>;
    },
    results: {
        content: ComponentType<{ test: TTestResult }>;
        footer?: ComponentType<{ test: TTestResult }>;
        card?: ComponentType<{ test: TTestResult }>;
    }
}