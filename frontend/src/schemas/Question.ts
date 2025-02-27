/**
 * Question schema for the test
 */
export default interface Question {
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