import MMPIQuestion from "@/tests/MMPITest/schemas/MMPIQuestion";
import QuestionBase from "@/components/QuestionCard/QuesitonBase";
import {Alert, Typography} from "@mui/material";

interface QuestionCardProps {
    question: MMPIQuestion;
    testId: string;
    index: number;
    disabled?: boolean;
    showScales?: boolean;
}

export default function QuestionCard(
    {question, testId, index, disabled, showScales}: QuestionCardProps
) {
    return (
        <QuestionBase
            question={{ question: question.question }}
            index={index}
            testId={testId}
            answers={[
                {
                    id: "1",
                    answer: "Погоджуюсь",
                },
                {
                    id: "2",
                    answer: "Не погоджуюсь",
                }
            ]}
            disabled={disabled ?? false}
            footer={showScales ? (
                <Alert severity="info" icon={false} sx={{width: "100%"}}>
                    {question.answers.map((answer, index) => (
                        <Typography key={index}>
                            <b>{answer.scales.join(", ")}</b>: {answer.answer ? "Погоджуюсь" : "Не погоджуюсь"}
                        </Typography>
                    ))}
                </Alert>
            ) : undefined}
        />
    );
}