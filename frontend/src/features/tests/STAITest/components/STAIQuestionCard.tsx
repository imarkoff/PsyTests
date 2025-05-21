import QuestionCard from "@/components/QuestionCard";
import STAIQuestion from "@/features/tests/STAITest/types/STAITest/STAIQuestion";
import STAIAnswer from "@/features/tests/STAITest/types/STAITest/STAIAnswer";
import RadioAnswer from "@/components/QuestionCard/types/RadioAnswer";
import {useMemo} from "react";
import {Alert} from "@mui/material";

interface STAIQuestionCardProps {
    answers: STAIAnswer[];
    question: STAIQuestion;
    index: number;
    disabled: boolean;
}

export default function STAIQuestionCard({answers, question, index, disabled}: STAIQuestionCardProps) {
    const convertedAnswers = useMemo(() => convertAnswers(answers), [answers]);

    return (
        <QuestionCard.Base
            index={index}
            moduleName={question.scale ?? undefined}
            header={<QuestionCard.Header title={question.question}/>}
            footer={question.scoring_type ? (
                <Alert severity="info" sx={{width: "100%"}}>
                    Тип оцінювання: {question.scoring_type === "positive" ? "позитивний" : "негативний"}
                </Alert>
            ) : undefined}
        >
            <QuestionCard.RadioGroup disabled={disabled} answers={convertedAnswers}/>
        </QuestionCard.Base>
    );
}

const convertAnswers = (answers: STAIAnswer[]) => (
    answers.map((answer, index): RadioAnswer => ({
        answer: answer.name,
        value: index
    }))
)