import TestBase from "@/schemas/TestBase";
import MMPIScale from "@/features/tests/MMPITest/schemas/MMPIScale";
import MMPIQuestion from "@/features/tests/MMPITest/schemas/MMPIQuestion";

export default interface MMPITest extends TestBase {
    scales: MMPIScale[];
    questions: MMPIQuestion[];
}