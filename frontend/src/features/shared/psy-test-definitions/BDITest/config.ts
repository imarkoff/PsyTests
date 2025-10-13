import TestConfigType from "@/features/shared/psy-test-definitions/TestConfig";
import BDITest from "@/features/shared/psy-test-definitions/BDITest/types/BDITest";
import BDIResult from "@/features/shared/psy-test-definitions/BDITest/types/BDIResult";
import BDITestHeader from "@/features/shared/psy-test-definitions/BDITest/layout/BDITestHeader";
import BDITestContent from "@/features/shared/psy-test-definitions/BDITest/layout/BDITestContent";
import BDIResultsContent from "@/features/shared/psy-test-definitions/BDITest/layout/BDIResultsContent";

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