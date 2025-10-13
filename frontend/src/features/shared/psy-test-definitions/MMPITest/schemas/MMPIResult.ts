import TestResult from "@/types/models/TestResult";

type MMPIResult = TestResult<MMPIVerdict>;
export default MMPIResult;

export interface MMPIVerdict {
    "raw": { [scale: string]: number };
    "converted": { [scale: string]: number };
    "scale_verdicts": { [scale: string]: string[] };
    "profile_types": string[];
    "profile_inclinations": string[];
}