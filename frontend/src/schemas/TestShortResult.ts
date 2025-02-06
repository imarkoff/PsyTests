import TestShort from "@/schemas/TestShort";

/**
 * Result of a test
 * @see TestShort
 */
export default interface TestShortResult {
    id: string;
    test: TestShort;
    patient_id: string;
    total_points: number;
    correct_points: number;
    result?: string;
    passed_at: string; // ISO date
}