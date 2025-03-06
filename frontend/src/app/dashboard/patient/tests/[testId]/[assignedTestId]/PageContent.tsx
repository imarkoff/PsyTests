import {useTestContext} from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/context/TestContext";
import {FormProvider, useForm} from "react-hook-form";
import {Box, Typography} from "@mui/material";
import LeaveTestButton from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/components/LeaveTestButton";
import QuestionCard from "@/components/QuestionCard/QuestionCard";
import PassTestButton from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/components/PassTestButton";
import PassTestData from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/schemas/PassTestData";
import countTestQuestions from "@/utils/countTestQuestions";

/**
 * Renders the test page content.
 */
export default function PageContent() {
    const {test, passTest, passed} = useTestContext();
    const methods = useForm<PassTestData>();

    const {questions, modules} = test || {};
    const { totalQuestions } = countTestQuestions(test);

    return (
        <Box sx={{maxWidth: 600, width: "100%", marginX: "auto", display: "flex", flexDirection: "column", gap: 1}}>
            <Box sx={{paddingX: 2, display: "flex", flexDirection: "column", gap: 1, alignItems: "start"}}>
                <LeaveTestButton />
                <Typography variant={"h5"}>
                    {test?.name}
                </Typography>
                <Typography>
                    <strong>Загальна кількість запитань:</strong> {totalQuestions}
                </Typography>
            </Box>

            <Box component={"form"} onSubmit={methods.handleSubmit(passTest)} sx={{display: "grid", gap: 2}}>
                <FormProvider {...methods}>
                    {questions?.map((question, index) => (
                        <QuestionCard
                            question={question}
                            key={index}
                            index={index}
                            testType={test!.type}
                            testId={test!.id}
                            disabled={passed}
                        />
                    ))}
                    {modules?.map(module =>
                        module.questions.map((question, index) => (
                            <QuestionCard
                                question={question}
                                key={index}
                                index={index}
                                testType={test!.type}
                                testId={test!.id}
                                module={{name: module.name, path: module.path}}
                                disabled={passed}
                            />
                        )))
                    }
                    <PassTestButton />
                </FormProvider>
            </Box>
        </Box>
    );
}