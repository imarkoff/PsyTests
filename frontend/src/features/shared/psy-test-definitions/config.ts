import { TestType } from "@/types/models/TestBase";
import ravenConfig from "@/features/shared/psy-test-definitions/RavenTest/config";
import mmpiConfig from "@/features/shared/psy-test-definitions/MMPITest/config";
import pcl5Config from "@/features/shared/psy-test-definitions/PCL5Test/config";
import TestConfigType from "@/features/shared/psy-test-definitions/TestConfig";
import bdiConfig from "@/features/shared/psy-test-definitions/BDITest/config";
import staiConfig from "@/features/shared/psy-test-definitions/STAITest/config";

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
    bdi: bdiConfig,
    stai: staiConfig
};

export default testsConfig;