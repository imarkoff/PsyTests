import TestResultShort from "@/types/models/TestResultShort";
import {Card, CardContent, CardHeader} from "@mui/material";
import TestValues from "@/components/TestValues";
import {dateMed} from "@/utils/formatDate";

export default function TestHistoryShortCard({ test }: { test: TestResultShort }) {
    return (
        <Card variant={"outlined"}>
            <CardHeader title={test.test_name} />

            <CardContent sx={{py: 0}}>
                <TestValues title={"Дата проходження"}>{dateMed(test.passed_at)}</TestValues>
            </CardContent>
        </Card>
    );
}