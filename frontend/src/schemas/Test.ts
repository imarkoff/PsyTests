import TestBase from "@/schemas/TestBase";

export default interface Test extends TestBase {
    questions: Question[] | null;
    modules: TestModule[] | null;
}

export interface TestModule {
    name: string;
    description?: string;
    path: string;
    questions: Question[];
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
 * @example
 * {
 *    "6": "Норма",
 *    "7": "Норма",
 *    "8": "Норма",
 *    "9": "Норма",
 *    "_": "30-35"
 * }
 */
export interface TestMark {
    _: string;
    [key: string]: string;
}