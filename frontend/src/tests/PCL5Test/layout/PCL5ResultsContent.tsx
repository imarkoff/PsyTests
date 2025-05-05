import PCL5Result from "@/tests/PCL5Test/types/PCL5Result";
import TestValues from "@/components/Test/TestValues";
import PCL5ResultsChart from "@/tests/PCL5Test/components/PCL5ResultsChart";
import getEventDescription from "@/tests/PCL5Test/utils/getEventDescription";
import countTotalMark from "@/tests/PCL5Test/utils/countTotalMark";

export default function PCL5ResultsContent({test}: {test: PCL5Result}) {
    return (
        <>
            <TroubleEvent result={test} />
            {test.verdict?.counts && (
                <PCL5ResultsChart counts={test.verdict.counts} />
            )}
        </>
    );
}

export function PCL5ResultsCard({test}: {test: PCL5Result}) {
    return (
        <>
            <TroubleEvent result={test} />
            {test.verdict?.verdict && (
                <TestValues title={"Висновок"}>{test.verdict?.verdict}</TestValues>
            )}
        </>
    );
}

export function PCL5ResultsFooter({test}: {test: PCL5Result}) {
    if (!test.verdict) return;

    const totalMark = countTotalMark(test.verdict.counts);

    return (
        <>
            <TestValues title={"Загальний бал"}>{totalMark}</TestValues>
            <TestValues title={"Висновок"}>{test.verdict.verdict}</TestValues>
        </>
    );
}

const TroubleEvent = ({result}: {result: PCL5Result}) => {
    const event = getEventDescription(result);

    return event ? (
        <TestValues title={"Подія"}>{event}</TestValues>
    ) : undefined;
}