import RavenResult from "@/tests/RavenTest/schemas/RavenResult";

export default function countCorrectAnswers(test: RavenResult): CorrectAnswers {
    let totalPoints = 0;
    let correctPoints = 0;

    for (const testModule in test.results) {
        for (const question of test.results[testModule]) {
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