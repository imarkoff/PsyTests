import {RavenResults} from "@/tests/RavenTest/schemas/RavenResult";

export default function countCorrectAnswers(results: RavenResults): CorrectAnswers {
    let totalPoints = 0;
    let correctPoints = 0;

    for (const testModule in results) {
        for (const question of results[testModule]) {
            totalPoints += question.points;
            if (question.user_answer === question.correct_answer) {
                correctPoints += question.points;
            }
        }
    }

    return {correctPoints, totalPoints};
}

export interface CorrectAnswers {
    correctPoints: number;
    totalPoints: number;
}