import {FormControlLabel, Radio, Typography} from "@mui/material";
import React from "react";
import LazyImage from "@/components/LazyImage";
import RadioAnswer from "@/components/QuestionCard/types/RadioAnswer";

type QuestionRadioAnswerProps = {
    answer: RadioAnswer,
    index: number,
    onChange: (value: string | number) => void,
    chosenAnswer?: number | string,
    correctAnswer?: number | string,
    disabled?: boolean,
};

export default function QuestionRadioAnswer(
    {answer, index, disabled, onChange, chosenAnswer, correctAnswer}: QuestionRadioAnswerProps
) {
    const radioColor = correctAnswer !== undefined ? (correctAnswer === index ? "success" : "error") : undefined;
    const isChecked = correctAnswer === index || chosenAnswer === index;

    return (
        <FormControlLabel
            value={index}
            onChange={() => onChange(index)}
            control={
                <Radio
                    color={radioColor}
                    checked={isChecked}
                />
            }
            sx={{ position: "relative", pointerEvents: disabled ? "none" : undefined }}
            label={
                <AnswerLabel
                    answer={answer}
                    index={index}
                />
            }
        />
    );
}

const AnswerLabel = (
    {answer, index}: { answer: RadioAnswer, index: number }
) => (
    <>
        <Typography variant={"body1"}>
            <Typography
                component={"span"}
                fontWeight={600}
                sx={answer.image ? {position: "absolute", left: 15} : {marginRight: 1}}
            >
                {index + 1}
                {!answer.image && "."}
            </Typography>
            {answer.answer}
        </Typography>

        {answer.image && (
            <LazyImage
                src={answer.image.src}
                alt={answer.image.alt}
                width={125}
                height={100}
                style={{pointerEvents: "none", height: "auto"}}
            />
        )}
    </>
);