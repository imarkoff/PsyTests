import { TestType } from "@/schemas/TestBase";
import ravenConfig from "@/tests/RavenTest/config";
import mmpiConfig from "@/tests/MMPITest/config";
import pcl5Config from "@/tests/PCL5Test/config";
import TestConfigType from "@/tests/TestConfig";

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
    mmpi_big: mmpiConfig,
    "pcl-5": pcl5Config
};

export default testsConfig;