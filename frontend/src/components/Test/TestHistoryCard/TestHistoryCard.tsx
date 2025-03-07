import TestResult from "@/schemas/TestResult";
import {Card, CardActions, CardContent, CardHeader} from "@mui/material";
import TestValues from "@/components/Test/TestValues";
import {dateMed} from "@/utils/formatDate";
import countCorrectAnswers from "@/utils/countCorrectAnswers";
import ResultsDialog from "@/components/Test/TestHistoryCard/ResultsDialog";

/**
 * Displays a card with information about the test result.
 * @param test
 * @constructor
 */
export default function TestHistoryCard({test}: { test: TestResult }) {
    const correctAnswers = test.test.type === "raven" ? countCorrectAnswers(test) : {correctPoints: 0, totalPoints: 0};
    const {correctPoints, totalPoints} = correctAnswers;

    return (
        <Card variant={"outlined"}>
            <CardHeader title={test.test.name}/>

            <CardContent sx={{paddingTop: 0, paddingBottom: 0}}>
                <TestValues title={"Дата проходження"}>{dateMed(test.passed_at)}</TestValues>
                <TestValues title={"Кількість набраних балів"}>{correctPoints} з {totalPoints}</TestValues>
                {test.verdict?.["_"] && (
                    <TestValues title={"Висновок"}>{test.verdict["_"]} {test.test.marks_unit}</TestValues>
                )}
            </CardContent>

            <CardActions>
                <ResultsDialog test={test}/>
            </CardActions>
        </Card>
    );
}