import TestBase from "@/schemas/TestBase";
import MMPIScale from "@/tests/MMPITest/schemas/MMPIScale";
import MMPIQuestion from "@/tests/MMPITest/schemas/MMPIQuestion";

export default interface MMPITest extends TestBase {
    scales: MMPIScale[];
    questions: MMPIQuestion[];
}