import TestBase from "@/schemas/TestBase";

/**
 * Result of a test
 * @see TestBase
 */
export default interface TestResult {
    id: string;
    test: TestBase;
    patient_id: string;
    results: Results;
    verdict?: string;
    passed_at: string; // ISO date
}

export interface Results {
    [module: string]: ResultsAnswer[];
}

export interface ResultsAnswer {
    user_answer: string | null;
    correct_answer: string;
    points: number;
}