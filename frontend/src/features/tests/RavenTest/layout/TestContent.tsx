import RavenTest from "@/features/tests/RavenTest/schemas/RavenTest";
import {Roles} from "@/schemas/Role";
import RavenQuestion from "@/features/tests/RavenTest/schemas/RavenQuestion";
import countTestQuestions from "@/features/tests/RavenTest/utils/countTestQuestions";
import {Typography} from "@mui/material";
import RavenQuestionCard from "@/features/tests/RavenTest/components/RavenQuestionCard";
import {TestInfoType} from "@/features/tests/TestConfig";

export const TestHeader = ({test, role}: TestInfoType<RavenTest>) => {
    const {totalQuestions, totalPoints} = countTestQuestions(test);

    return (
        <>
            <Typography>
                <strong>Кількість питань:</strong> {totalQuestions}
            </Typography>
            {role !== Roles.patient && (
                <Typography>
                    <strong>Максимальна кількість балів:</strong> {totalPoints}
                </Typography>
            )}
        </>
    );
};

export default function TestContent({test, role, disabled}: TestInfoType<RavenTest>) {
    const getCorrectAnswer = (question: RavenQuestion) => {
        if (role === Roles.patient) return undefined;
        return question.answers.findIndex(answer => answer.is_correct);
    }

    return (
        <>
            {test?.questions?.map((question, index) => (
                <RavenQuestionCard
                    question={question}
                    correctAnswer={getCorrectAnswer(question)}
                    key={`${test.id}/question/${index}`}
                    testId={test.id}
                    index={index}
                    disabled={disabled}
                />
            ))}

            {test?.modules?.map((module, index) => (
                module.questions.map((question, j) => (
                    <RavenQuestionCard
                        question={question}
                        correctAnswer={getCorrectAnswer(question)}
                        key={`${test.id}/module/${index}/question/${j}`}
                        module={module}
                        testId={test.id}
                        index={j}
                        disabled={disabled}
                    />
                ))
            ))}
        </>
    );
}