import TestBase, { TestType } from "@/schemas/TestBase";
import {ComponentType} from "react";
import TestInfoType from "@/tests/TestInfoType";
import ravenConfig from "@/tests/RavenTest/config";
import mmpiConfig from "@/tests/MMPITest/config";

export interface TestConfigType<T extends TestBase> {
    test: {
        header: ComponentType<TestInfoType<T>>;
        content: ComponentType<TestInfoType<T>>;
    }
}

type TestsConfigType = {
    // eslint-disable-next-line -- Each test may have its own type
    [key in TestType]: TestConfigType<any>
};

const testsConfig: TestsConfigType = {
    raven: ravenConfig,
    mmpi: mmpiConfig,
};

export default testsConfig;