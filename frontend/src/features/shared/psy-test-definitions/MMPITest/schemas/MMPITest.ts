import TestBase from "@/types/models/TestBase";
import MMPIScale from "@/features/shared/psy-test-definitions/MMPITest/schemas/MMPIScale";
import MMPIQuestion from "@/features/shared/psy-test-definitions/MMPITest/schemas/MMPIQuestion";

export default interface MMPITest extends TestBase {
    scales: MMPIScale[];
    questions: MMPIQuestion[];
}