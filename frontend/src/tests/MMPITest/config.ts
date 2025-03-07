import {TestConfigType} from "@/tests/config";
import TestContent, {TestHeader} from "@/tests/MMPITest/layout/TestContent";
import MMPITest from "@/tests/MMPITest/schemas/MMPITest";

const mmpiConfig: TestConfigType<MMPITest> = {
    test: {
        header: TestHeader,
        content: TestContent,
    }
};

export default mmpiConfig;