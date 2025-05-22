"use client";

import LeaveTestButton from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/components/LeaveTestButton";
import {Box, Skeleton, Typography} from "@mui/material";
import {Roles} from "@/schemas/Role";
import testsConfig from "@/features/tests/config";
import {useTestContext} from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/hooks/useTestContext";

export default function PassTestHeader() {
    const {test, passed, error} = useTestContext();

    const testLayout = test ? testsConfig[test.type] : null;
    const Header = testLayout?.test.header;

    const animation = error ? false : undefined;

    return (
        <Box sx={{paddingX: 2, display: "flex", flexDirection: "column", gap: 1, alignItems: "start"}}>
            <LeaveTestButton />

            {test ? (
                <Typography variant={"h5"}>{test?.name}</Typography>
            ) : (
                <Skeleton variant={"text"} sx={{ fontSize: "2rem" }} width={"100%"} animation={animation} />
            )}

            {test ? (
                Header && <Header test={test} role={Roles.patient} disabled={passed} />
            ) : (
                <Skeleton variant={"text"} sx={{ fontSize: "1.25rem" }} width={250} animation={animation} />
            )}
        </Box>
    );
}