import TestConfigType from "@/features/tests/TestConfig";
import STAITest from "@/features/tests/STAITest/types/STAITest";
import STAIResult from "@/features/tests/STAITest/types/STAIResult";
import STAITestContent, {STAITestHeader} from "@/features/tests/STAITest/layout/STAITestContent";
import STAIResultsContent from "@/features/tests/STAITest/layout/STAIResultsContent";

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