"use client";

import {PCL5Test} from "@/features/tests/PCL5Test/types/PCL5Test";
import getTestMetrics from "@/features/tests/PCL5Test/utils/getTestMetrics";
import {useMemo} from "react";
import {Typography} from "@mui/material";
import {Roles} from "@/types/enums/Role";
import PCL5QuestionCard from "@/features/tests/PCL5Test/components/PCL5QuestionCard";
import {TestInfoType} from "@/features/tests/TestConfig";

export function PCL5ContentHeader({test, role}: TestInfoType<PCL5Test>) {
    const {
        questionCount,
        maxPossibleScore
    } = useMemo(() => getTestMetrics(test), [test]);

    return (
        <>
            <Typography>
                <strong>Кількість питань:</strong> {questionCount}
            </Typography>
            {role !== Roles.patient && (
                <Typography>
                    <strong>Максимальна кількість балів:</strong> {maxPossibleScore}
                </Typography>
            )}
        </>
    );
}

export default function PCL5Content({test, role, disabled}: TestInfoType<PCL5Test>) {
    return (
        <>
            {test?.questions?.map((question, index) => (
                <PCL5QuestionCard
                    question={question}
                    answers={test.answers}
                    index={index}
                    showCriteria={role !== Roles.patient}
                    key={`${test.id}/question/${index}`}
                    disabled={disabled}
                />
            ))}
        </>
    );
}