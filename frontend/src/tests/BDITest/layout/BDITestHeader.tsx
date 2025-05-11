import TestInfoType from "@/tests/TestInfoType";
import BDITest from "@/tests/BDITest/types/BDITest";
import getBDITestMetrics from "@/tests/BDITest/utils/getBDITestMetrics";
import { useMemo } from "react";
import {Typography} from "@mui/material";
import {Roles} from "@/schemas/Role";

export default function BDITestHeader({test, role}: TestInfoType<BDITest>) {
    const {
        questionCount,
        maxPossibleScore
    } = useMemo(() => getBDITestMetrics(test), [test]);

    return (
        <>
            <Typography>
                <strong>Загальна кількість питань:</strong> {questionCount}
            </Typography>
            {role !== Roles.patient && (
                <Typography>
                    <strong>Максимальна кількість балів:</strong> {maxPossibleScore}
                </Typography>
            )}
        </>
    );
}
