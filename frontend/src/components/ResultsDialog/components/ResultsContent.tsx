import TestResult from "@/types/models/TestResult";
import {Box, DialogContent} from "@mui/material";
import TestValues from "@/components/TestValues";
import {dateMed} from "@/utils/formatDate";
import ExportButton from "@/components/ResultsDialog/components/ExportButton";
import testsConfig from "@/features/tests/config";

export default function ResultsContent({ testResult }: { testResult: TestResult }) {
    const testResultComponents = testsConfig[testResult.test.type]?.results;
    const Content = testResultComponents?.content;
    const Footer = testResultComponents?.footer;

    return (
        <DialogContent sx={{display: "grid", gap: 2}}>
            {Content && <Content test={testResult} />}
            <Box sx={{display: "flex", gap: 1, alignItems: "end", flexWrap: "wrap"}}>
                <Box>
                    {Footer && <Footer test={testResult} />}
                    <TestValues title={"Дата проходження"}>{dateMed(testResult.passed_at)}</TestValues>
                </Box>
                <Box sx={{display: "flex", gap: 1, justifyContent: "end", flexGrow: 1}}>
                    <ExportButton test={testResult} />
                </Box>
            </Box>
        </DialogContent>
    );
}