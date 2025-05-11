import TestConfigType from "@/tests/TestConfig";
import BDITest from "@/tests/BDITest/types/BDITest";
import BDIResult from "@/tests/BDITest/types/BDIResult";
import BDITestHeader from "@/tests/BDITest/layout/BDITestHeader";
import BDITestContent from "@/tests/BDITest/layout/BDITestContent";
import BDIResultsContent from "@/tests/BDITest/layout/BDIResultsContent";

const bdiConfig: TestConfigType<BDITest, BDIResult> = {
    test: {
        header: BDITestHeader,
        content: BDITestContent
    },
    results: {
        content: BDIResultsContent
    }
}

export default bdiConfig;