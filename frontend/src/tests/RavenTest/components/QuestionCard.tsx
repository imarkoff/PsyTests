import QuestionBase from "@/components/QuestionCard/QuesitonBase";
import Question from "@/tests/RavenTest/schemas/Question";
import {TestModule} from "@/tests/RavenTest/schemas/RavenTest";

interface QuestionCardProps {
    question: Question;
    correctAnswer?: number;
    testId: string;
    module?: TestModule;
    index: number;
    disabled?: boolean;
}

export default function QuestionCard(
    { question, correctAnswer, testId, module, index, disabled }: QuestionCardProps
) {
    return (
        <QuestionBase
            question={question}
            answers={question.answers}
            correctAnswer={correctAnswer}
            module={module ? {name: module.name, path: module.path} : undefined}
            testId={testId}
            index={index}
            disabled={disabled ?? false}
        />
    );
}