import TestConfigType from "@/features/tests/TestConfig";
import TestContent, {TestHeader} from "@/features/tests/MMPITest/layout/TestContent";
import MMPITest from "@/features/tests/MMPITest/schemas/MMPITest";
import ResultsContent from "@/features/tests/MMPITest/layout/ResultsContent";
import MMPIResult from "@/features/tests/MMPITest/schemas/MMPIResult";
import MarksContent from "@/features/tests/MMPITest/layout/MarksContent/MarksContent";

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