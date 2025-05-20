import BDITest, {BDIQuestion} from "@/features/tests/BDITest/types/BDITest";

/**
 * Get the number of questions and the maximum possible score for a BDI test
 * @param test The BDI test object
 */
export default function getBDITestMetrics(test: BDITest) {
    let questionCount = 0;
    let maxPossibleScore = 0;

    test.questions.forEach((question) => {
        questionCount++;
        maxPossibleScore += getMaxScoreForQuestion(question);
    })

    return { questionCount, maxPossibleScore };
}

const getMaxScoreForQuestion = (question: BDIQuestion) => {
    let maxScore = 0;
    question.answers.forEach((answer) => {
        if (answer.mark && answer.mark > maxScore)
            maxScore = answer.mark;
    })
    return maxScore;
}