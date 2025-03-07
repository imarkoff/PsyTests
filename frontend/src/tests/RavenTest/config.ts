import {TestConfigType} from "@/tests/config";
import TestContent, {TestHeader} from "@/tests/RavenTest/layout/TestContent";
import RavenTest from "@/tests/RavenTest/schemas/RavenTest";

const ravenConfig: TestConfigType<RavenTest> = {
    test: {
        header: TestHeader,
        content: TestContent,
    }
};

export default ravenConfig;