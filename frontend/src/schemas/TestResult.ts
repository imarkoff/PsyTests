import TestBase from "@/schemas/TestBase";

/**
 * Result of a test
 * @see TestBase
 */
export default interface TestResult<
    Results extends object = object,
    Verdict extends object = object
> {
    id: string;
    test: TestBase;
    patient_id: string;
    results: Results | null;
    verdict: Verdict | null;
    passed_at: string; // ISO date
}