/**
 * Question schema for the test
 */
export default interface RavenQuestion {
    id: string;
    question?: string;
    image?: string;
    answers: RavenAnswer[];
    points?: number; // default 1
}

export interface RavenAnswer {
    id: string;
    answer?: string;
    image?: string;
    is_correct?: boolean;
}