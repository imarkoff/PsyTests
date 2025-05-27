import STAITest from "@/features/tests/STAITest/types/STAITest";
import {Typography} from "@mui/material";
import STAIQuestionCard from "@/features/tests/STAITest/components/STAIQuestionCard";
import {TestInfoType} from "@/features/tests/TestConfig";

export function STAITestHeader({test}: TestInfoType<STAITest>) {
    return (
        <Typography>
            <strong>Кількість питань:</strong> {test.questions.length}
        </Typography>
    );
}

export default function STAITestContent({test, disabled}: TestInfoType<STAITest>) {
    return (
        <>
            {test.questions.map((question, index) => (
                <STAIQuestionCard
                    question={question}
                    answers={test.answers}
                    disabled={disabled ?? false}
                    index={index}
                    key={index}
                />
            ))}
        </>
    );
}