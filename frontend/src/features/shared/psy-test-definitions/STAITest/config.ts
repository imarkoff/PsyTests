import TestConfigType from "@/features/shared/psy-test-definitions/TestConfig";
import STAITest from "@/features/shared/psy-test-definitions/STAITest/types/STAITest";
import STAIResult from "@/features/shared/psy-test-definitions/STAITest/types/STAIResult";
import STAITestContent, {STAITestHeader} from "@/features/shared/psy-test-definitions/STAITest/layout/STAITestContent";
import STAIResultsContent from "@/features/shared/psy-test-definitions/STAITest/layout/STAIResultsContent";

const staiConfig: TestConfigType<STAITest, STAIResult> = {
    test: {
        header: STAITestHeader,
        content: STAITestContent
    },
    results: {
        content: STAIResultsContent
    }
}

export default staiConfig;