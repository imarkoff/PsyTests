import TestResult from "@/schemas/TestResult";
import STAIScaleScore from "@/features/tests/STAITest/types/STAIResult/STAIScaleScore";
import STAIScaleVerdict from "@/features/tests/STAITest/types/STAIResult/STAIScaleVerdict";

type STAIResult = TestResult<STAIVerdict>;
export default STAIResult;

export interface STAIVerdict {
    score: STAIScaleScore[];
    verdicts: STAIScaleVerdict[];
}