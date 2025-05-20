import MMPIQuestion from "@/features/tests/MMPITest/schemas/MMPIQuestion";
import {Alert, Typography} from "@mui/material";
import QuestionCard from "@/components/QuestionCard";
import MMPIAnswer from "@/features/tests/MMPITest/schemas/MMPIAnswer";

interface QuestionCardProps {
    question: MMPIQuestion;
    index: number;
    disabled?: boolean;
    showScales?: boolean;
}

export default function MMPIQuestionCard(
    {question, index, disabled, showScales}: QuestionCardProps
) {
    return (
        <QuestionCard.Base
            index={index}
            header={<QuestionCard.Header title={question.question}/>}
            footer={showScales ? <MMPIQuestionCardFooter answers={question.answers}/> : undefined}
        >
            <QuestionCard.RadioGroup
                answers={[
                    {answer: "Погоджуюсь"},
                    {answer: "Не погоджуюсь"}
                ]}
                disabled={disabled}
            />
        </QuestionCard.Base>
    );
}

const MMPIQuestionCardFooter = ({answers}: { answers: MMPIAnswer[] }) => (
    <Alert severity="info" icon={false} sx={{width: "100%"}}>
        {answers.map((answer, index) => (
            <Typography key={index}>
                <b>{answer.scales.join(", ")}</b>: {answer.answer ? "Погоджуюсь" : "Не погоджуюсь"}
            </Typography>
        ))}
    </Alert>
);