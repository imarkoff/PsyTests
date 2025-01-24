export default interface Test {
    id: string;
    name: string;
    description?: string;
    questions: Question[];
    marks: TestMarks;
}

/**
 * Question schema for the test
 */
export interface Question {
    id: string;
    question?: string;
    image?: string;
    answers: Answer[];
    points?: number; // default 1
}

export interface Answer {
    id: string;
    answer?: string;
    image?: string;
    is_correct?: boolean;
}

/**
 * TestMarks schema for the test.
 * @description
 * Each mark means range of points percentage.
 * Example: 25-75 (75 is inclusive): Intermediate intelligence
 * @example
 * {
 *     "5": "Low intelligence",
 *     "25": "Below average intelligence",
 *     "75": "Intermediate intelligence",
 *     "95": "Upper intermediate intelligence",
 *     "100": "High intelligence"
 * }
 */
export interface TestMarks {
    [key: string]: string;
}