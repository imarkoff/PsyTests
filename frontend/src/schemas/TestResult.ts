import TestShort from "@/schemas/TestShort";

/**
 * Result of a test
 * @see TestShort
 */
export default interface TestResult {
    id: string;
    test: TestShort;
    patient_id: string;
    results: Results;
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