import {FormControlLabel, Radio, Typography} from "@mui/material";
import {testImage} from "@/services/testsService";
import React from "react";
import LazyImage from "@/components/LazyImage";
import {QuestionBaseProps} from "@/components/QuestionCard/QuesitonCard";
import {Answer} from "@/schemas/Question";

type TestAnswerProps = {
    answer: Answer,
    onChange: (moduleName: string | undefined, index: number) => void,
    chosenAnswer?: number,
    correctAnswer?: number,
} & QuestionBaseProps;

export default function TestAnswer(
    {answer, testId, index, module, disabled, onChange, chosenAnswer, correctAnswer}: TestAnswerProps
) {
    const radioColor = correctAnswer !== undefined ? (correctAnswer === index ? "success" : "error") : undefined;
    const isChecked = correctAnswer === index || chosenAnswer === index;

    return (
        <FormControlLabel
            value={index}
            onChange={() => onChange(module?.name, index)}
            control={
                <Radio
                    color={radioColor}
                    checked={isChecked}
                />
            }
            sx={{ position: "relative", pointerEvents: disabled ? "none" : undefined }}
            label={
                <AnswerLabel
                    testId={testId}
                    modulePath={module?.path}
                    answer={answer}
                    index={index}
                />
            }
        />
    );
}

const AnswerLabel = (
    {testId, answer, index, modulePath}: { testId: string, answer: Answer, index: number, modulePath?: string }
) => (
    <>
        <Typography
            variant={"h6"}
            sx={answer.image ? {position: "absolute", left: 15} : {marginRight: 1}}
        >
            {index + 1}
        </Typography>

        <Typography variant={"h6"}>{answer.answer}</Typography>

        {answer.image && (
            <LazyImage
                src={testImage(testId, modulePath, answer.image)}
                alt={answer.answer || `${index + 1}`}
                width={150}
                height={100}
                style={{pointerEvents: "none", height: "auto"}}
            />
        )}
    </>
);