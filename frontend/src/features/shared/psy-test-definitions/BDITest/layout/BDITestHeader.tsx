import BDITest from "@/features/shared/psy-test-definitions/BDITest/types/BDITest";
import getBDITestMetrics from "@/features/shared/psy-test-definitions/BDITest/utils/getBDITestMetrics";
import { useMemo } from "react";
import {Typography} from "@mui/material";
import {Roles} from "@/types/enums/Role";
import {TestInfoType} from "@/features/shared/psy-test-definitions/TestConfig";

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
