"use client";

import {Box, CircularProgress, Typography} from "@mui/material";
import {useParams} from "next/navigation";
import useTest from "@/app/dashboard/doctor/tests/[testId]/hooks/useTest";
import countTestQuestions from "@/utils/countTestQuestions";
import AssignTestButton from "@/app/dashboard/doctor/tests/AssignTestDialog/AssignTestButton";
import MarksDialog from "@/components/Test/Marks/MarksDialog";
import {useTestsContext} from "@/app/dashboard/doctor/tests/context/TestsContext";
import QuestionCard from "@/components/QuestionCard/QuestionCard";

export default function TestPage() {
    const { testId } = useParams<{ testId: string }>();

    const { selectedTest } = useTestsContext() || {};
    const { test, isLoading } = useTest(testId);
    const testBase = selectedTest || test;

    const {totalQuestions, totalPoints} = test ? countTestQuestions(test) : {totalQuestions: 0, totalPoints: 0};

    return (
        <>
            <Box sx={{px: 2, pt: 1, display: "grid", gap: .5}}>
                <Typography variant={"h5"}>{testBase?.name}</Typography>
                <Typography>{testBase?.description}</Typography>

                <Typography>
                    <strong>Кількість питань:</strong> {totalQuestions}
                </Typography>
                <Typography>
                    <strong>Максимальна кількість балів:</strong> {totalPoints}
                </Typography>

                <Box sx={{display: "flex", alignItems: "center", gap: 1, py: 1}}>
                    <AssignTestButton testId={testId} />
                    {test?.marks_path && <MarksDialog test={test} />}
                </Box>
            </Box>

            {test?.questions?.map((question, index) => (
                <QuestionCard
                    question={question}
                    correctAnswer={question.answers.findIndex(answer => answer.is_correct)}
                    key={`${test.id}/question/${index}`}
                    testType={test.type}
                    testId={test.id}
                    index={index}
                    disabled
                />
            ))}

            {test?.modules?.map((module, index) => (
                module.questions.map((question, j) => (
                    <QuestionCard
                        question={question}
                        correctAnswer={question.answers.findIndex(answer => answer.is_correct)}
                        key={`${test.id}/module/${index}/question/${j}`}
                        module={{name: module.name, path: module.path}}
                        testId={test.id}
                        testType={test.type}
                        index={j}
                        disabled
                    />
                ))
            ))}

            {isLoading && <LoadingLayout />}

        </>
    );
}

const LoadingLayout = () => (
    <Box sx={{
        height: "100%",
        width: "100%",
        flexGrow: 1,
        display: "grid",
        placeItems: "center"
    }}>
        <CircularProgress />
    </Box>
);