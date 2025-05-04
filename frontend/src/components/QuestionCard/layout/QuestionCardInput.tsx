"use client";

import {OutlinedInput} from "@mui/material";
import {useQuestionCardContext} from "@/components/QuestionCard/context/QuestionCardContext";
import { ChangeEvent } from "react";

export default function QuestionCardInput({disabled}: {disabled?: boolean}) {
    const { handleAnswerChange } = useQuestionCardContext();

    const changeAnswer = (e: ChangeEvent<HTMLInputElement>) => {
        handleAnswerChange(e.target.value);
    }

    return (
        <OutlinedInput fullWidth disabled={disabled} onChange={changeAnswer} />
    );
}