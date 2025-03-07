import TestResult from "@/schemas/TestResult";
import {Card, CardActions, CardContent, CardHeader} from "@mui/material";
import TestValues from "@/components/Test/TestValues";
import {dateMed} from "@/utils/formatDate";
import ResultsDialog from "@/components/Test/TestHistoryCard/ResultsDialog";
import testsConfig from "@/tests/config";

/**
 * Displays a card with information about the test result.
 * @param test
 * @constructor
 */
export default function TestHistoryCard({test}: { test: TestResult }) {
    const {card: Content} = testsConfig[test.test.type].results;

    return (
        <Card variant={"outlined"}>
            <CardHeader title={test.test.name}/>

            <CardContent sx={{paddingTop: 0, paddingBottom: 0}}>
                <TestValues title={"Дата проходження"}>{dateMed(test.passed_at)}</TestValues>
                {Content && <Content test={test} />}
            </CardContent>

            <CardActions>
                <ResultsDialog test={test}/>
            </CardActions>
        </Card>
    );
}