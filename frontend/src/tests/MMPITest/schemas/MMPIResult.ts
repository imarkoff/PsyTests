import TestResult from "@/schemas/TestResult";

type MMPIResult = TestResult<object, MMPIVerdict>;
export default MMPIResult;

export interface MMPIVerdict {
    "raw": { [key: string]: number; };
    "converted": { [key: string]: number; };
}