import {Box} from "@mui/material";
import TestsLayoutBox from "@/features/dashboard/patient/components/TestsLayoutBox";
import TestHistoryShortCard from "@/components/TestHistoryCard/TestHistoryShortCard";
import TestResultShort from "@/schemas/TestResultShort";

export default function TestsHistoryLayout({testsHistory}: {testsHistory: TestResultShort[] | undefined}) {
    return (
        <TestsLayoutBox title={"Історія проходження тестів"}>
            <Box sx={{display: "grid", gridTemplateColumns: {sm: "repeat(auto-fill, minmax(400px, 1fr))"}, gap: 2}}>
                {testsHistory?.map(test =>
                    <TestHistoryShortCard test={test} key={test.id} />
                )}
            </Box>
        </TestsLayoutBox>
    );
}