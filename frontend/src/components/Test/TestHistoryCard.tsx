import TestResult from "@/schemas/TestResult";
import {Card, CardActions, CardContent, CardHeader, Typography} from "@mui/material";
import TestValues from "@/components/Test/TestValues";
import {dateMed} from "@/utils/formatDate";

export default function TestHistoryCard({test}: {test: TestResult}) {
    return (
        <Card variant={"outlined"}>
            <CardHeader title={test.test.name} />

            <CardContent sx={{paddingTop: 0, paddingBottom: 0}}>
                <TestValues title={"Дата проходження"}>{dateMed(test.passed_at)}</TestValues>
                <TestValues title={"Кількість набраних балів"}>{test.correct_points} з {test.total_points}</TestValues>
            </CardContent>

            <CardActions sx={{justifyContent: "space-between", paddingLeft: 2, paddingRight: 2}}>
                <Typography>
                    Висновок:
                </Typography>
                <Typography fontWeight={600}>
                    {test.result}
                </Typography>
            </CardActions>
        </Card>
    );
}