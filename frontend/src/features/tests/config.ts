import { TestType } from "@/schemas/TestBase";
import ravenConfig from "@/features/tests/RavenTest/config";
import mmpiConfig from "@/features/tests/MMPITest/config";
import pcl5Config from "@/features/tests/PCL5Test/config";
import TestConfigType from "@/features/tests/TestConfig";
import bdiConfig from "@/features/tests/BDITest/config";

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
    "pcl-5": pcl5Config,
    bdi: bdiConfig
};

export default testsConfig;