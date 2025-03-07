import {TestConfigType} from "@/tests/config";
import TestContent, {TestHeader} from "@/tests/MMPITest/layout/TestContent";
import MMPITest from "@/tests/MMPITest/schemas/MMPITest";
import ResultsContent from "@/tests/MMPITest/layout/ResultsContent";
import MMPIResult from "@/tests/MMPITest/schemas/MMPIResult";

const mmpiConfig: TestConfigType<MMPITest, MMPIResult> = {
    test: {
        header: TestHeader,
        content: TestContent,
    },
    results: {
        content: ResultsContent,
    }
};

export default mmpiConfig;