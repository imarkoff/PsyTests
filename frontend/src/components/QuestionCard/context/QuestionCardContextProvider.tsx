"use client";

import {ReactNode} from "react";
import QuestionCardContext from "@/components/QuestionCard/context/QuestionCardContext";
import {useFormContext} from "react-hook-form";
import useValueChanger from "@/components/QuestionCard/hooks/useValueChanger";

interface QuestionCardContextProps {
    index: number;
    moduleName?: string;
    children: ReactNode;
}

export default function QuestionCardContextProvider(
    {index, moduleName, children}: QuestionCardContextProps
) {
    const {register, formState, setValue} = useFormContext() || {};

    const error = formState?.errors[index];
    const fieldName = `${moduleName ?? "_"}.${index}`;

    const handleRegister = () => register?.(fieldName);

    const {chosenAnswer, handleAnswerChange} = useValueChanger(fieldName, setValue);

    return (
        <QuestionCardContext.Provider value={{
            register: handleRegister,
            error,
            index,
            moduleName,
            chosenAnswer,
            handleAnswerChange
        }}>
            {children}
        </QuestionCardContext.Provider>
    );
}