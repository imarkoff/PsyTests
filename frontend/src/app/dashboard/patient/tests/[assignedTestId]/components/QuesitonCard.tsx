import {Answer, Question} from "@/schemas/Test";
import {Button, Card, CardContent, CardHeader, CardMedia, Typography} from "@mui/material";
import {testImage} from "@/services/testsService";
import Image from "next/image";

type QuestionBaseProps = {
    index: number;
    testId: string;
    chosenAnswer?: number;
    setChosenAnswer?: (answerId: number) => void;
}

type QuestionCardProps = { question: Question; } & QuestionBaseProps;
type TestAnswerProps = { answer: Answer; } & QuestionBaseProps;

export default function QuestionCard(
    {question, index, testId, chosenAnswer, setChosenAnswer}: QuestionCardProps
) {
    return (
        <Card variant={"outlined"}>
            <CardHeader title={`${index+1}. ${question.question ?? ""}`} />

            {question.image && (
                <CardMedia component={"img"} image={testImage(testId, question.image)} height={"100%"} />
            )}

            <CardContent sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "1rem",
                justifyItems: "center",
            }}>
                {question.answers.map((answer, index) => (
                    <TestAnswer
                        key={index}
                        answer={answer}
                        testId={testId}
                        index={index}
                        chosenAnswer={chosenAnswer}
                        setChosenAnswer={(answerId) => setChosenAnswer?.(answerId)}
                    />
                ))}
            </CardContent>
        </Card>
    );
}

const TestAnswer = (
    {answer, testId, index, chosenAnswer, setChosenAnswer}: TestAnswerProps
) => (
    <Button
        component={"div"}
        key={index}
        sx={{flexDirection: "column"}}
        variant={chosenAnswer === index ? "contained" : undefined}
        onClick={() => setChosenAnswer?.(index)}
    >
        <Typography variant={"h6"}>
            {index+1}{answer.answer && ")"} {answer.answer}
        </Typography>
        {answer.image && (
            <Image
                loader={({src}) => src}
                src={testImage(testId, answer.image)}
                alt={`${index+1}`}
                width={150}
                height={100}
                style={{pointerEvents: "none"}}
            />
        )}
    </Button>
);