import STAITest from "@/features/shared/psy-test-definitions/STAITest/types/STAITest";
import {Typography} from "@mui/material";
import STAIQuestionCard from "@/features/shared/psy-test-definitions/STAITest/components/STAIQuestionCard";
import {TestInfoType} from "@/features/shared/psy-test-definitions/TestConfig";

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