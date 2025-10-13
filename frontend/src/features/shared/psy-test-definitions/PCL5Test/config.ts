import TestConfigType from "@/features/shared/psy-test-definitions/TestConfig";
import {PCL5Test} from "@/features/shared/psy-test-definitions/PCL5Test/types/PCL5Test";
import PCL5Result from "@/features/shared/psy-test-definitions/PCL5Test/types/PCL5Result";
import PCL5Content, {PCL5ContentHeader} from "@/features/shared/psy-test-definitions/PCL5Test/layout/PCL5Content";
import PCL5ResultsContent, {PCL5ResultsCard, PCL5ResultsFooter} from "@/features/shared/psy-test-definitions/PCL5Test/layout/PCL5ResultsContent";

const pcl5Config: TestConfigType<PCL5Test, PCL5Result> = {
    test: {
        header: PCL5ContentHeader,
        content: PCL5Content
    },
    results: {
        content: PCL5ResultsContent,
        card: PCL5ResultsCard,
        footer: PCL5ResultsFooter,
    }
}

export default pcl5Config;