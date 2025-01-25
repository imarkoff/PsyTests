"use client";

import {Box, Typography} from "@mui/material";
import QuestionCard from "@/app/dashboard/patient/tests/[assignedTestId]/components/QuesitonCard";
import TestProvider, {AssignedTestIdParams} from "@/app/dashboard/patient/tests/[assignedTestId]/context/TestProvider";
import {useTestContext} from "@/app/dashboard/patient/tests/[assignedTestId]/context/TestContext";
import LeaveTestButton from "@/app/dashboard/patient/tests/[assignedTestId]/components/LeaveTestButton";

const PageContent = () => {
    const {test, getAnswer, setAnswer} = useTestContext();

    return (
        <Box sx={{maxWidth: 600, marginX: "auto", display: "flex", flexDirection: "column", gap: 1}}>
            <Box sx={{paddingX: 2, display: "flex", flexDirection: "column", gap: 1, alignItems: "start"}}>
                <LeaveTestButton />
                <Typography variant={"h5"}>
                    {test?.test.name}
                </Typography>
            </Box>
            {test?.test.questions.map((question, index) => (
                <QuestionCard
                    question={question}
                    key={index}
                    index={index}
                    testId={test.test.id}
                    chosenAnswer={getAnswer(index)}
                    setChosenAnswer={(answerId) => setAnswer(index, answerId)}
                />
            ))}
        </Box>
    );
}

export default function Page({ params }: { params: AssignedTestIdParams }) {
    return (
        <TestProvider params={params}>
            <PageContent />
        </TestProvider>
    );
}