import TestContent, {TestHeader} from "@/features/tests/RavenTest/layout/TestContent";
import RavenTest from "@/features/tests/RavenTest/schemas/RavenTest";
import ResultsContent, {ResultsCard, ResultsFooter} from "@/features/tests/RavenTest/layout/ResultsContent";
import RavenResult from "@/features/tests/RavenTest/schemas/RavenResult";
import MarksContent from "@/features/tests/RavenTest/layout/MarksContent";
import TestConfigType from "@/features/tests/TestConfig";

const ravenConfig: TestConfigType<RavenTest, RavenResult> = {
    test: {
        header: TestHeader,
        content: TestContent,
        marks: MarksContent,
    },
    results: {
        content: ResultsContent,
        footer: ResultsFooter,
        card: ResultsCard,
    }
};

export default ravenConfig;