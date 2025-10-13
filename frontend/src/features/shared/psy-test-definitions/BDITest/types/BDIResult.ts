import TestResult from "@/types/models/TestResult";

type BDIResult = TestResult<BDIVerdict>;
export default BDIResult;

export interface BDIVerdict {
    total_score: number;
    verdict: string | null;
}