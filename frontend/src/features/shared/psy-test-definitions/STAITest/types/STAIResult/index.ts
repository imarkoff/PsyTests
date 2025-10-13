import TestResult from "@/types/models/TestResult";
import STAIScaleScore from "@/features/shared/psy-test-definitions/STAITest/types/STAIResult/STAIScaleScore";
import STAIScaleVerdict from "@/features/shared/psy-test-definitions/STAITest/types/STAIResult/STAIScaleVerdict";

type STAIResult = TestResult<STAIVerdict>;
export default STAIResult;

export interface STAIVerdict {
    score: STAIScaleScore[];
    verdicts: STAIScaleVerdict[];
}