import TestResult from "@/schemas/TestResult";

type PCL5Result = TestResult<object, PCL5Verdict>;
export default PCL5Result;

export interface PCL5Verdict {
    counts: PCL5VerdictCounts;
    verdict: string | null;
}

interface PCL5VerdictCounts {
    [criteria: string]: number;
}