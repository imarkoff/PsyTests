import {useTestContext} from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/context/TestContext";
import {FormProvider, useForm} from "react-hook-form";
import {Box, Typography} from "@mui/material";
import LeaveTestButton from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/components/LeaveTestButton";
import PassTestButton from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/components/PassTestButton";
import PassTestData from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/schemas/PassTestData";
import testsConfig from "@/tests/config";
import {Roles} from "@/schemas/Role";

/**
 * Renders the test page content.
 */
export default function PageContent() {
    const {test, passTest, passed} = useTestContext();
    const methods = useForm<PassTestData>();

    const testLayout = test ? testsConfig[test.type] : null;
    const Header = testLayout?.test.header;
    const Content = testLayout?.test.content;

    return (
        <Box sx={{maxWidth: 600, width: "100%", marginX: "auto", display: "flex", flexDirection: "column", gap: 1}}>
            <Box sx={{paddingX: 2, display: "flex", flexDirection: "column", gap: 1, alignItems: "start"}}>
                <LeaveTestButton />
                <Typography variant={"h5"}>
                    {test?.name}
                </Typography>
                {Header && <Header test={test} role={Roles.patient} disabled={passed} />}
            </Box>

            <Box component={"form"} onSubmit={methods.handleSubmit(passTest)} sx={{display: "grid", gap: 2}}>
                <FormProvider {...methods}>
                    {Content && <Content test={test} role={Roles.patient} disabled={passed} />}
                    <PassTestButton />
                </FormProvider>
            </Box>
        </Box>
    );
}