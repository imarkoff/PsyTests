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
import {Answer} from "@/schemas/Question";

export type QuestionBaseProps = {
    /** Index of the question in the test */
    index: number;
    /** ID of the test */
    testId: string;
    /** Whether the question is disabled */
    disabled: boolean;
    /** Correct answer for the question */
    correctAnswer?: number;
    /** Module where the question belongs */
    module?: { name: string; path: string; }
}

type QuestionCardProps = {
    /** The question to render */
    question: {
        question?: string;
        image?: string;
    };
    answers: Answer[];
} & QuestionBaseProps;

/**
 * Renders a single question with its answers.
 */
export default function QuestionBase(
    {question, index, testId, disabled, module, correctAnswer, answers}: QuestionCardProps
) {
    const {register, formState: {errors}, setValue} = useFormContext() || {formState: {errors: []}};
    const isError = Boolean(errors[index]);

    const fieldName = `${module ? module.name : "_"}.${index}`;

    // used for showing answers from hidden input.
    // using hidden input because of LazyComponent cannot register all inputs at once
    const [chosenAnswer, setChosenAnswer] = useState<number>();
    const handleAnswerChange = (moduleName: string | undefined, chosenNumber: number) => {
        setChosenAnswer(chosenNumber);
        setValue(`${moduleName ?? "_"}.${index}`, chosenNumber);
    };

    return (
        <LazyComponent
            height={"400px"}
            visibleChildren={<input type="hidden" {...register?.(fieldName)} />}
        >
            <Card variant={"outlined"} sx={{
                borderColor: isError ? "error.main" : undefined,
                borderWidth: isError ? "2px" : undefined,
                overflow: "visible",
                width: "100%"
            }}>
                <CardHeader
                    title={`${module?.name ?? ""} ${index+1}. ${question.question ?? ""}`}
                    subheader={isError ? "Оберіть відповідь" : undefined}
                    slotProps={{
                        subheader: {
                            sx: { color: "error", variant: "caption" }
                        }
                    }}
                />

                {question.image && (
                    <CardMedia>
                        <LazyImage
                            src={testImage(testId, module?.path ?? null, question.image)}
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
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: "1rem",
                            justifyContent: "space-evenly",
                        }}
                        defaultValue={correctAnswer}
                        name={`question-${index}`}
                    >
                        {answers.map((answer, j) => (
                            <TestAnswer
                                key={j}
                                index={j}
                                testId={testId}
                                answer={answer}
                                module={module}
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