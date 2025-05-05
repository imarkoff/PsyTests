import TestResult from "@/schemas/TestResult";

type PCL5Result = TestResult<PCL5Results, PCL5Verdict>;
export default PCL5Result;

interface PCL5Results {
    _: (string | number | null)[];
}

export interface PCL5Verdict {
    counts: PCL5VerdictCounts;
    verdict: string | null;
}

export interface PCL5VerdictCounts {
    [criteria: string]: number;
}