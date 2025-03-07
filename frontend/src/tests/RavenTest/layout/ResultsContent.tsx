import ResultsTable from "@/tests/RavenTest/components/ResultsTable";
import TestValues from "@/components/Test/TestValues";
import countCorrectAnswers from "@/tests/RavenTest/utils/countCorrectAnswers";
import RavenResult from "@/tests/RavenTest/schemas/RavenResult";

interface ResultsProps { test: RavenResult; }

export default function ResultsContent({test}: ResultsProps) {
    return (
        <>
            {test.results && (
                <ResultsTable results={test.results} />
            )}
        </>
    );
}

export const ResultsFooter = ({test}: ResultsProps) => {
    return (
        <>
            {test.verdict?.["_"] && (
                <TestValues title={"Висновок"}>{test.verdict["_"]} {test.test.marks_unit}</TestValues>
            )}
        </>
    );
}


export const ResultsCard = ({test}: ResultsProps) => {
    const {correctPoints, totalPoints} = countCorrectAnswers(test);

    return (
        <>
            <TestValues title={"Кількість набраних балів"}>{correctPoints} з {totalPoints}</TestValues>
            {test.verdict?.["_"] && (
                <TestValues title={"Висновок"}>{test.verdict["_"]} {test.test.marks_unit}</TestValues>
            )}
        </>
    );
}