import {FormControlLabel, Radio, Typography} from "@mui/material";
import {testImage} from "@/services/testsService";
import React from "react";
import {Answer} from "@/schemas/Test";
import LazyImage from "@/components/LazyImage";
import {QuestionBaseProps} from "@/components/QuestionCard/QuesitonCard";

type TestAnswerProps = {
    answer: Answer,
    onChange: (index: number) => void,
    chosenAnswer?: number,
    correctAnswer?: number,
} & QuestionBaseProps;

export default function TestAnswer(
    {answer, testId, index, disabled, onChange, chosenAnswer, correctAnswer}: TestAnswerProps
) {
    return (
        <FormControlLabel
            value={index}
            onChange={() => onChange(index)}
            control={
                <Radio
                    color={correctAnswer !== undefined ? (correctAnswer === index ? "success" : "error") : undefined}
                    checked={(correctAnswer === index || chosenAnswer === index) ? true : undefined}
                />
            }
            sx={{ position: "relative", pointerEvents: disabled ? "none" : undefined }}
            label={
                <AnswerLabel
                    testId={testId}
                    answer={answer}
                    index={index}
                />
            }
        />
    );
}

const AnswerLabel = (
    {testId, answer, index}: { testId: string, answer: Answer, index: number }
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
                src={testImage(testId, answer.image)}
                alt={answer.answer || `${index + 1}`}
                width={150}
                height={100}
                style={{pointerEvents: "none", height: "auto"}}
            />
        )}
    </>
);