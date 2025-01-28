import {FormControlLabel, Radio, Typography} from "@mui/material";
import Image from "next/image";
import {testImage} from "@/services/testsService";
import React from "react";
import {Answer} from "@/schemas/Test";
import {QuestionBaseProps} from "@/app/dashboard/patient/tests/[assignedTestId]/components/QuestionCard/QuesitonCard";
import {useFormContext} from "react-hook-form";

type TestAnswerProps = { questionIndex: number, answer: Answer } & QuestionBaseProps;

export default function TestAnswer(
    {questionIndex, answer, testId, index, disabled}: TestAnswerProps
) {
    const { register } = useFormContext() || { register: () => {} };

    return (
        <FormControlLabel
            {...register(questionIndex.toString(), { required: true })}
            value={index}
            control={ <Radio color={answer.is_correct ? "success" : undefined} /> }
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
            <Image
                loader={({src, width, quality}) => `${src}&w=${width}&q=${quality || 75}`}
                src={testImage(testId, answer.image)}
                alt={`${index + 1}`}
                width={150}
                height={100}
                style={{pointerEvents: "none", height: "auto"}}
            />
        )}
    </>
);