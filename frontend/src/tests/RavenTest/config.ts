import {TestConfigType} from "@/tests/config";
import TestContent, {TestHeader} from "@/tests/RavenTest/layout/TestContent";
import RavenTest from "@/tests/RavenTest/schemas/RavenTest";
import ResultsContent, {ResultsCard, ResultsFooter} from "@/tests/RavenTest/layout/ResultsContent";
import RavenResult from "@/tests/RavenTest/schemas/RavenResult";
import MarksContent from "@/tests/RavenTest/layout/MarksContent";

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