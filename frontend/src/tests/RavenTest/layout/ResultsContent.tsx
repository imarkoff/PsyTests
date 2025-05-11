import ResultsTable from "@/tests/RavenTest/components/ResultsTable";
import TestValues from "@/components/Test/TestValues";
import countCorrectAnswers from "@/tests/RavenTest/utils/countCorrectAnswers";
import RavenResult from "@/tests/RavenTest/schemas/RavenResult";

interface ResultsProps { test: RavenResult; }

export default function ResultsContent({test}: ResultsProps) {
    return (
        <>
            {test.verdict && (
                <ResultsTable results={test.verdict.results} />
            )}
        </>
    );
}

export const ResultsFooter = ({test}: ResultsProps) => {
    return (
        <>
            {test.verdict?.verdict && (
                <TestValues title={"Висновок"}>{test.verdict.verdict} {test.test.marks_unit}</TestValues>
            )}
        </>
    );
}


export const ResultsCard = ({test}: ResultsProps) => {
    const verdict = test.verdict;

    const {correctPoints, totalPoints} = verdict
        ? countCorrectAnswers(verdict.results)
        : {correctPoints: 0, totalPoints: 0};

    return (
        <>
            <TestValues title={"Кількість набраних балів"}>{correctPoints} з {totalPoints}</TestValues>
            {verdict && (
                <TestValues title={"Висновок"}>{verdict.verdict} {test.test.marks_unit}</TestValues>
            )}
        </>
    );
}