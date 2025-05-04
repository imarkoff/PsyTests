import PCL5Question from "@/tests/PCL5Test/types/PCL5Question";
import PCL5Answer from "@/tests/PCL5Test/types/PCL5Answer";
import QuestionCard from "@/components/QuestionCard";
import RadioAnswer from "@/components/QuestionCard/types/RadioAnswer";

interface PCL5QuestionCardProps {
    question: PCL5Question;
    answers: PCL5Answer[];
    showCriteria?: boolean;
    index: number;
    disabled?: boolean;
}

export default function PCL5QuestionCard(
    {question, answers, showCriteria, index, disabled = false}: PCL5QuestionCardProps
) {
    const convertedAnswers = convertAnswers(answers);

    return (
        <QuestionCard.Base
            index={index}
            moduleName={showCriteria ? question.criteria : undefined}
            header={<QuestionCard.Header title={question.question} />}
        >
            {question.type === "radio" && (
                <QuestionCard.RadioGroup
                    answers={convertedAnswers}
                    disabled={disabled}
                />
            )}
            {question.type === "input" && (
                <QuestionCard.Input disabled={disabled} />
            )}
        </QuestionCard.Base>
    )
}

/**
 * Converts PCL5Answer objects to RadioAnswer objects that can be used by QuestionCard.RadioGroup
 * @param answers - Array of PCL5Answer objects
 * @returns Array of RadioAnswer objects
 */
const convertAnswers = (answers: PCL5Answer[]) => {
    return answers.map((answer): RadioAnswer => ({
        answer: answer.answer,
        value: answer.mark
    }));
}