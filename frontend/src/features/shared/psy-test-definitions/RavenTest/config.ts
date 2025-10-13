import TestContent, {TestHeader} from "@/features/shared/psy-test-definitions/RavenTest/layout/TestContent";
import RavenTest from "@/features/shared/psy-test-definitions/RavenTest/schemas/RavenTest";
import ResultsContent, {ResultsCard, ResultsFooter} from "@/features/shared/psy-test-definitions/RavenTest/layout/ResultsContent";
import RavenResult from "@/features/shared/psy-test-definitions/RavenTest/schemas/RavenResult";
import MarksContent from "@/features/shared/psy-test-definitions/RavenTest/layout/MarksContent";
import TestConfigType from "@/features/shared/psy-test-definitions/TestConfig";

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