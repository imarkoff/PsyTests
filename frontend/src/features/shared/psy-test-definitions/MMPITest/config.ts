import TestConfigType from "@/features/shared/psy-test-definitions/TestConfig";
import TestContent, {TestHeader} from "@/features/shared/psy-test-definitions/MMPITest/layout/TestContent";
import MMPITest from "@/features/shared/psy-test-definitions/MMPITest/schemas/MMPITest";
import ResultsContent from "@/features/shared/psy-test-definitions/MMPITest/layout/ResultsContent";
import MMPIResult from "@/features/shared/psy-test-definitions/MMPITest/schemas/MMPIResult";
import MarksContent from "@/features/shared/psy-test-definitions/MMPITest/layout/MarksContent/MarksContent";

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