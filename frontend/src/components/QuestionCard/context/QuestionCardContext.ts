import {createContext, useContext} from "react";
import {FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn} from "react-hook-form";

type FormError = FieldError | Merge<FieldError, FieldErrorsImpl> | undefined;

const QuestionCardContext = createContext<{
    register?: () => UseFormRegisterReturn;
    error: FormError;
    index: number;
    moduleName?: string;
    chosenAnswer: string | number | undefined;
    handleAnswerChange: (newAnswer: string | number) => void;
}>({
    error: undefined,
    index: 0,
    chosenAnswer: undefined,
    handleAnswerChange: () => {}
});

export default QuestionCardContext;

export const useQuestionCardContext = () => useContext(QuestionCardContext);