import {PCL5Test} from "@/features/tests/PCL5Test/types/PCL5Test";

/**
 * Get PCL5 test metrics
 * @param test
 */
export default function getTestMetrics(test: PCL5Test) {
    const countableCriterias = test.criterion
        .filter((criterion) => criterion.countable)
        .map((criterion) => criterion.criteria);

    const highestPossibleMark = Math.max(...test.answers.map(answer => answer.mark))

    let questionCount = 0;
    let maxPossibleScore = 0;

    test.questions.forEach((question) => {
        if (countableCriterias.includes(question.criteria)) {
            questionCount++;
            maxPossibleScore += highestPossibleMark;
        }
    })

    return {
        questionCount,
        maxPossibleScore
    }
}