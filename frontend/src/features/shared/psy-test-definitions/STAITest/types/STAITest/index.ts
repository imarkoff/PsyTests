import TestBase from "@/types/models/TestBase";
import STAIScale from "@/features/shared/psy-test-definitions/STAITest/types/STAITest/STAIScale";
import STAIAnswer from "@/features/shared/psy-test-definitions/STAITest/types/STAITest/STAIAnswer";
import STAIQuestion from "@/features/shared/psy-test-definitions/STAITest/types/STAITest/STAIQuestion";

export default interface STAITest extends TestBase {
    scales: STAIScale[];
    answers: STAIAnswer[];
    questions: STAIQuestion[];
}