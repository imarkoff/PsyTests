import TestInfoType from "@/tests/TestInfoType";
import MMPITest from "@/tests/MMPITest/schemas/MMPITest";
import {Typography} from "@mui/material";
import QuestionCard from "@/tests/MMPITest/components/QuestionCard";
import {Roles} from "@/schemas/Role";

export const TestHeader = ({test}: TestInfoType<MMPITest>) => {
    const totalQuestions = test.questions.length;

    return (
        <>
            <Typography>
                <strong>Кількість питань:</strong> {totalQuestions}
            </Typography>
        </>
    );
};

export default function TestContent({test, role, disabled}: TestInfoType<MMPITest>) {
    return (
        <>
            {test?.questions?.map((question, index) => (
                <QuestionCard
                    question={question}
                    key={`${test.id}/question/${index}`}
                    testId={test.id}
                    index={index}
                    disabled={disabled}
                    showScales={role === Roles.doctor}
                />
            ))}
        </>
    );
}