import {useState} from "react";

export default function useValueChanger(
    inputName: string,
    setValue: (name: string, value: string | number) => void
) {
    const [chosenAnswer, setChosenAnswer] = useState<string | number>();
    const handleAnswerChange = (newAnswer: string | number) => {
        setChosenAnswer(newAnswer);
        setValue(inputName, newAnswer);
    };

    return {
        chosenAnswer,
        handleAnswerChange,
    }
}