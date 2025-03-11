import {TestConfigType} from "@/tests/config";
import TestContent, {TestHeader} from "@/tests/MMPITest/layout/TestContent";
import MMPITest from "@/tests/MMPITest/schemas/MMPITest";
import ResultsContent from "@/tests/MMPITest/layout/ResultsContent";
import MMPIResult from "@/tests/MMPITest/schemas/MMPIResult";
import MarksContent from "@/tests/MMPITest/layout/MarksContent/MarksContent";

const mmpiConfig: TestConfigType<MMPITest, MMPIResult> = {
    test: {
        header: TestHeader,
        content: TestContent,
        marks: MarksContent
    },
    results: {
        content: ResultsContent,
    }
};

export default mmpiConfig;