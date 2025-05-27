import MMPITest from "@/features/tests/MMPITest/schemas/MMPITest";
import {Alert, Typography} from "@mui/material";
import MMPIQuestionCard from "@/features/tests/MMPITest/components/MMPIQuestionCard";
import {Roles} from "@/schemas/Role";
import {TestInfoType} from "@/features/tests/TestConfig";

export const TestHeader = ({test}: TestInfoType<MMPITest>) => {
    const totalQuestions = test.questions.length;

    return (
        <>
            <Typography>
                <strong>Кількість питань:</strong> {totalQuestions}
            </Typography>
        </>
    );
};

export default function TestContent({test, role, disabled}: TestInfoType<MMPITest>) {
    return (
        <>
            {role !== Roles.patient && (
                <Alert
                    color={"info"}
                    icon={false}
                    slotProps={{message: {sx: {display: "flex", gap: 2, flexWrap: "wrap"}}}}
                >
                    {test.scales.map((scale, index) => (
                        <Typography key={index}>
                            <b>
                                {scale.label}
                                {scale.abbrev ? ` (${scale.abbrev})` : ""}
                            </b> - {scale.name}
                        </Typography>
                    ))}
                </Alert>
            )}
            {test.questions.map((question, index) => (
                <MMPIQuestionCard
                    question={question}
                    key={`${test.id}/question/${index}`}
                    index={index}
                    disabled={disabled}
                    showScales={role !== Roles.patient}
                />
            ))}
        </>
    );
}