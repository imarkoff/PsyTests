import QuestionCard from "@/components/QuestionCard";
import {BDIAnswer, BDIQuestion} from "@/features/shared/psy-test-definitions/BDITest/types/BDITest";
import RadioAnswer from "@/components/QuestionCard/types/RadioAnswer";
import { useMemo } from "react";

interface BDIQuestionCardProps {
    question: BDIQuestion;
    index: number;
    disabled: boolean | undefined;
}

export default function BDIQuestionCard({question, index, disabled}: BDIQuestionCardProps) {
    const convertedAnswers = useMemo(() => convertAnswers(question.answers), [question.answers]);

    return (
        <QuestionCard.Base
            header={<QuestionCard.Header />}
            index={index}
        >
            <QuestionCard.RadioGroup
                answers={convertedAnswers}
                disabled={disabled}
                align={"left"}
            />
        </QuestionCard.Base>
    );
}

const convertAnswers = (answers: BDIAnswer[]): RadioAnswer[] =>
    answers.map((answer) => ({
        answer: answer.name,
        value: answer.mark
    } as RadioAnswer));