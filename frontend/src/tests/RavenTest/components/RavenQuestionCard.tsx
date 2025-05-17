import QuestionCard from "@/components/QuestionCard";
import RavenQuestion, {RavenAnswer} from "@/tests/RavenTest/schemas/RavenQuestion";
import RadioAnswer from "@/components/QuestionCard/types/RadioAnswer";
import { useMemo } from "react";
import {TestModule} from "@/tests/RavenTest/schemas/RavenTest";
import getRavenTestImageUrl from "@/tests/RavenTest/utils/getRavenTestImageUrl";

interface QuestionCardProps {
    question: RavenQuestion;
    correctAnswer?: number;
    testId: string;
    module?: TestModule;
    index: number;
    disabled?: boolean;
}

export default function RavenQuestionCard(
    { question, correctAnswer, testId, module, index, disabled }: QuestionCardProps
) {
    const interpretedAnswers = useMemo(
        () => interpretRavenAnswers(testId, module?.path, question.answers),
        [testId, module?.path, question.answers]
    );

    return (
        <QuestionCard.Base
            index={index}
            moduleName={module?.name}
            header={<QuestionCard.Header />}
            image={question.image ? (
                <QuestionCard.Image
                    src={getRavenTestImageUrl(testId, module?.path, question.image)}
                    alt={question.question ?? index.toString()}
                />
            ) : undefined}
        >
            <QuestionCard.RadioGroup
                answers={interpretedAnswers}
                disabled={disabled}
                correctAnswer={correctAnswer}
            />
        </QuestionCard.Base>
    )
}

const interpretRavenAnswers = (
    testId: string, modulePath: string | undefined, answers: RavenAnswer[]
): RadioAnswer[] => (
    answers.map(answer => ({
        image: answer.image ? {
            src: getRavenTestImageUrl(testId, modulePath, answer.image),
            alt: answer.answer ?? answer.id ?? "",
        } : undefined
    } as RadioAnswer))
)