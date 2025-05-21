import TestBase from "@/schemas/TestBase";
import STAIScale from "@/features/tests/STAITest/types/STAITest/STAIScale";
import STAIAnswer from "@/features/tests/STAITest/types/STAITest/STAIAnswer";
import STAIQuestion from "@/features/tests/STAITest/types/STAITest/STAIQuestion";

export default interface STAITest extends TestBase {
    scales: STAIScale[];
    answers: STAIAnswer[];
    questions: STAIQuestion[];
}