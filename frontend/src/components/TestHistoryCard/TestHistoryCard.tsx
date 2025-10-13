import TestResult from "@/types/models/TestResult";
import {Card, CardActions, CardContent, CardHeader} from "@mui/material";
import TestValues from "@/components/TestValues";
import {dateMed} from "@/utils/formatDate";
import ResultsDialog from "@/components/ResultsDialog/ResultsDialog";
import testsConfig from "@/features/shared/psy-test-definitions/config";

/**
 * Displays a card with information about the test result.
 * @param test
 * @constructor
 */
export default function TestHistoryCard({test}: { test: TestResult }) {
    const testResultComponents = testsConfig[test.test.type]?.results;
    const Content = testResultComponents?.card;

    return (
        <Card variant={"outlined"} sx={{justifyContent: "space-between", display: "flex", flexDirection: "column"}}>
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