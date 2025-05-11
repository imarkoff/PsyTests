import TestBase from "@/schemas/TestBase";

/**
 * Result of a test
 * @see TestBase
 */
export default interface TestResult<
    Verdict extends object | null = null
> {
    id: string;
    test: TestBase;
    patient_id: string;
    results: TestResultResults | null;
    verdict: Verdict | null;
    passed_at: string; // ISO date
}

interface TestResultResults {
    _: (string | number | null)[];
    [module: string]: (string | number | null)[];
}