import TestResult from "@/types/models/TestResult";

type RavenResult = TestResult<RavenVerdict>;
export default RavenResult;

export interface RavenVerdict {
    results: RavenResults;
    verdict: string | number;
}

export interface RavenResults {
    [module: string]: ResultsAnswer[];
}

export interface ResultsAnswer {
    user_answer: string | null;
    correct_answer: string;
    points: number;
}