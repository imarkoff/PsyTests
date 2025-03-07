import TestResult from "@/schemas/TestResult";

type RavenResult = TestResult<Results, Verdict>;
export default RavenResult;

export interface Results {
    [module: string]: ResultsAnswer[];
}

export interface ResultsAnswer {
    user_answer: string | null;
    correct_answer: string;
    points: number;
}

export interface Verdict {
    "_": string | number;
}