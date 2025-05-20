import {RavenResults} from "@/features/tests/RavenTest/schemas/RavenResult";


interface RavenPointsSum {
    correct: number;
    total: number;
}


export const getLongestModule = (results: RavenResults) =>
    Math.max(...Object.values(results).map(answers => answers.length));

export const calculatePointsByModule = (results: RavenResults): RavenPointsSum[] =>
    Object.values(results).map(answers => answers.reduce(
        (acc, q) => ({
            correct: acc.correct + (q.user_answer === q.correct_answer ? q.points : 0),
            total: acc.total + q.points
        })
        , {correct: 0, total: 0}
    ));

export const calculateTotalScore = (pointsByModule: RavenPointsSum[]) =>
    pointsByModule.reduce((acc, {correct, total}) => ({
        correct: acc.correct + correct,
        total: acc.total + total
    }), {correct: 0, total: 0});