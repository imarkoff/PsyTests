import TestConfigType from "@/features/tests/TestConfig";
import BDITest from "@/features/tests/BDITest/types/BDITest";
import BDIResult from "@/features/tests/BDITest/types/BDIResult";
import BDITestHeader from "@/features/tests/BDITest/layout/BDITestHeader";
import BDITestContent from "@/features/tests/BDITest/layout/BDITestContent";
import BDIResultsContent from "@/features/tests/BDITest/layout/BDIResultsContent";

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