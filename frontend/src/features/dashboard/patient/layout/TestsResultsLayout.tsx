import {Box} from "@mui/material";
import TestsLayoutBox, {TestsLayoutError} from "@/features/dashboard/patient/components/TestsLayoutBox";
import TestHistoryShortCard from "@/components/TestHistoryCard/TestHistoryShortCard";
import TestResultShort from "@/schemas/TestResultShort";
import { ApiResponse } from "@/lib/api-client/types";

export default function TestsResultsLayout(
    {testResultsResponse}: {testResultsResponse: ApiResponse<TestResultShort[]>}
) {
    const { data: testsHistory, error } = testResultsResponse;

    return (
        <TestsLayoutBox title={"Історія проходження тестів"}>
            <Box sx={{display: "grid", gridTemplateColumns: {sm: "repeat(auto-fill, minmax(400px, 1fr))"}, gap: 2}}>
                {testsHistory?.map(test =>
                    <TestHistoryShortCard test={test} key={test.id} />
                )}
            </Box>
            {error && (
                <TestsLayoutError error={error} friendlyMessage={`
                    Сталася помилка при завантаженні історії тестів.
                    Спробуйте ще раз або зверніться до лікаря.
                `} />
            )}
        </TestsLayoutBox>
    );
}