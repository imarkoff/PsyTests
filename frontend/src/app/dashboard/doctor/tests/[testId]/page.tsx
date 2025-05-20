"use client";

import {Box, CircularProgress, Typography} from "@mui/material";
import {useParams} from "next/navigation";
import useTest from "@/app/dashboard/doctor/tests/[testId]/hooks/useTest";
import AssignTestButton from "@/app/dashboard/doctor/tests/AssignTestDialog/AssignTestButton";
import MarksDialog from "@/components/Test/Marks/MarksDialog";
import {useTestsContext} from "@/app/dashboard/doctor/tests/context/TestsContext";
import testsConfig from "@/features/tests/config";
import { Roles } from "@/schemas/Role";

export default function TestPage() {
    const { testId } = useParams<{ testId: string }>();

    const { selectedTest } = useTestsContext();
    const { test, isLoading } = useTest(testId);
    const testBase = selectedTest || test;

    const testLayout = test ? testsConfig[test.type] : null;
    const Header = testLayout?.test.header;
    const Content = testLayout?.test.content;
    const Marks = testLayout?.test.marks;

    return (
        <>
            <Box sx={{px: 2, pt: 1, display: "grid", gap: .5}}>
                <Typography variant={"h5"}>{testBase?.name}</Typography>
                <Typography>{testBase?.description}</Typography>

                {Header && <Header test={test} role={Roles.doctor} disabled />}

                <Box sx={{display: "flex", alignItems: "center", gap: 1, py: 1}}>
                    <AssignTestButton testId={testId} />
                    {test && Marks && (
                        <MarksDialog test={test}>
                            <Marks test={test} role={Roles.doctor} />
                        </MarksDialog>
                    )}
                </Box>
            </Box>

            {Content && <Content test={test} role={Roles.doctor} disabled />}

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