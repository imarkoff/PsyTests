import {useTestContext} from "@/app/dashboard/patient/tests/[assignedTestId]/context/TestContext";
import {FormProvider, useForm} from "react-hook-form";
import {Box, Typography} from "@mui/material";
import LeaveTestButton from "@/app/dashboard/patient/tests/[assignedTestId]/components/LeaveTestButton";
import QuestionCard from "@/components/QuestionCard/QuesitonCard";
import PassTestButton from "@/app/dashboard/patient/tests/[assignedTestId]/components/PassTestButton";
import PassTestData from "@/app/dashboard/patient/tests/[assignedTestId]/schemas/PassTestData";

/**
 * Renders the test page content. Separated for SSR.
 */
export default function PageContent() {
    const {test, passTest, result} = useTestContext();
    const methods = useForm<PassTestData>();

    return (
        <Box sx={{maxWidth: 600, marginX: "auto", display: "flex", flexDirection: "column", gap: 1}}>
            <Box sx={{paddingX: 2, display: "flex", flexDirection: "column", gap: 1, alignItems: "start"}}>
                <LeaveTestButton />
                <Typography variant={"h5"}>
                    {test?.test.name}
                </Typography>
            </Box>

            <Box component={"form"} onSubmit={methods.handleSubmit(passTest)} sx={{display: "grid", gap: 2}}>
                <FormProvider {...methods}>
                    {test?.test.questions?.map((question, index) => (
                        <QuestionCard
                            question={question}
                            key={index}
                            index={index}
                            testId={test.test.id}
                            disabled={!!result}
                        />
                    ))}
                    {test?.test.modules?.map(module =>
                        module.questions.map((question, index) => (
                            <QuestionCard
                                question={question}
                                key={index}
                                index={index}
                                testId={test.test.id}
                                module={{name: module.name, path: module.path}}
                                disabled={!!result}
                            />
                        )))
                    }
                    <PassTestButton />
                </FormProvider>
            </Box>
        </Box>
    );
}