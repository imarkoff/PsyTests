import TestBase, { TestType } from "@/schemas/TestBase";
import {ComponentType} from "react";
import TestInfoType from "@/tests/TestInfoType";
import ravenConfig from "@/tests/RavenTest/config";
import mmpiConfig from "@/tests/MMPITest/config";
import TestResult from "@/schemas/TestResult";

/**
 * Configuration of a test components.
 */
export interface TestConfigType<
    TTest extends TestBase,
    TTestResult extends TestResult<object, object>
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

type TestsConfigType = {
    // eslint-disable-next-line -- Each test may have its own type
    [key in TestType]: TestConfigType<any, any>;
};

/**
 * Configuration of all tests.
 * Add new tests here.
 */
const testsConfig: TestsConfigType = {
    raven: ravenConfig,
    mmpi: mmpiConfig,
};

export default testsConfig;