import {Question} from "@/schemas/Test";
import {
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    RadioGroup,
} from "@mui/material";
import {testImage} from "@/services/testsService";
import React, {useState} from "react";
import TestAnswer from "@/components/QuestionCard/TestAnswer";
import {useFormContext} from "react-hook-form";
import LazyImage from "@/components/LazyImage";
import LazyComponent from "@/components/LazyComponent";

export type QuestionBaseProps = {
    /** Index of the question in the test */
    index: number;
    /** ID of the test */
    testId: string;
    /** Whether the question is disabled */
    disabled: boolean;
    /** Correct answer for the question */
    correctAnswer?: number;
}

type QuestionCardProps = {
    /** The question to render */
    question: Question;
} & QuestionBaseProps;

/**
 * Renders a single question with its answers.
 */
export default function QuestionCard(
    {question, index, testId, disabled, correctAnswer}: QuestionCardProps
) {
    const {register, formState: {errors}, setValue} = useFormContext() || {formState: {errors: []}};
    const isError = errors[index];

    // used for showing answers from hidden input.
    // using hidden input because of LazyComponent cannot register all inputs at once
    const [chosenAnswer, setChosenAnswer] = useState<number>();
    const handleAnswerChange = (chosenNumber: number) => {
        setChosenAnswer(chosenNumber);
        setValue(`${index}`, chosenNumber);
    };

    return (
        <LazyComponent
            height={"400px"}
            visibleChildren={<input type="hidden" {...register?.(`${index}`)} />}
        >
            <Card variant={"outlined"} sx={{
                borderColor: isError ? "error.main" : undefined,
                borderWidth: isError ? "2px" : undefined,
                overflow: "visible"
            }}>
                <CardHeader
                    title={`${index+1}. ${question.question ?? ""}`}
                    subheader={isError && "Оберіть відповідь"}
                    slotProps={{
                        subheader: {
                            sx: {
                                color: "error",
                                variant: "caption",
                            }
                        }
                    }}
                />

                {question.image && (
                    <CardMedia>
                        <LazyImage
                            src={testImage(testId, question.image)}
                            alt={question.question || `${index + 1}`}
                            width={600}
                            height={250}
                            style={{pointerEvents: "none", height: "auto", width: "100%"}}
                        />
                    </CardMedia>
                )}

                <CardContent>
                    <RadioGroup
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                            gap: "1rem",
                            justifyItems: "center",
                        }}
                        defaultValue={question.answers.findIndex(answer => answer.is_correct)}
                        name={`question-${index}`}
                    >
                        {question.answers.map((answer, j) => (
                            <TestAnswer
                                key={j}
                                index={j}
                                testId={testId}
                                answer={answer}
                                onChange={handleAnswerChange}
                                chosenAnswer={chosenAnswer}
                                correctAnswer={correctAnswer}
                                disabled={disabled}
                            />
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>
        </LazyComponent>
    );
}