"use client";

import { RadioGroup } from "@mui/material";
import React from "react";
import {useQuestionCardContext} from "@/components/QuestionCard/context/QuestionCardContext";
import QuestionRadioAnswer from "@/components/QuestionCard/components/QuestionRadioAnswer";
import RadioAnswer from "@/components/QuestionCard/types/RadioAnswer";

interface QuestionCardRadioGroupProps {
    answers: RadioAnswer[],
    correctAnswer?: number | string,
    disabled?: boolean,
    align?: "left" | "space-evenly" | "right",
}

export default function QuestionCardRadioGroup(
    {answers, correctAnswer, disabled, align="space-evenly"}: QuestionCardRadioGroupProps
) {
    const { index, chosenAnswer, handleAnswerChange } = useQuestionCardContext();
    
    return (
        <RadioGroup
            sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: align,
            }}
            defaultValue={correctAnswer}
            name={`question-${index}`}
        >
            {answers.map((answer, j) => (
                <QuestionRadioAnswer
                    key={j}
                    index={j}
                    answer={answer}
                    onChange={handleAnswerChange}
                    chosenAnswer={chosenAnswer}
                    correctAnswer={correctAnswer}
                    disabled={disabled}
                />
            ))}
        </RadioGroup>
    );
}