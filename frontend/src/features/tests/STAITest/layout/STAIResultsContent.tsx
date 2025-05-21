import STAIResult from "@/features/tests/STAITest/types/STAIResult";
import {Divider, Stack} from "@mui/material";
import STAIScaleResultItem from "@/features/tests/STAITest/components/STAIScaleResultItem";

export default function STAIResultsContent({test}: { test: STAIResult }) {
    if (!test.verdict) return null;

    const {score: scores, verdicts} = test.verdict;

    return (
        <Stack
            spacing={2}
            px={2}
            divider={<Divider/>}
        >
            {scores.map((score, index) => (
                <STAIScaleResultItem
                    key={index}
                    score={score}
                    scaleVerdict={verdicts.find(verdict => verdict.scale_label === score.scale_label)}
                />
            ))}
        </Stack>
    );
}