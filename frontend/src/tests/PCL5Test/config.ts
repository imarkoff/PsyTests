import {TestConfigType} from "@/tests/config";
import {PCL5Test} from "@/tests/PCL5Test/types/PCL5Test";
import PCL5Result from "@/tests/PCL5Test/types/PCL5Result";
import PCL5Content, {PCL5ContentHeader} from "@/tests/PCL5Test/layout/PCL5Content";

const pcl5Config: TestConfigType<PCL5Test, PCL5Result> = {
    test: {
        header: PCL5ContentHeader,
        content: PCL5Content
    },
    results: {

    }
}

export default pcl5Config;