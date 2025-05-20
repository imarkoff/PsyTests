import {PCL5VerdictCounts} from "@/features/tests/PCL5Test/types/PCL5Result";

export default function countTotalMark(results: PCL5VerdictCounts) {
    const marksList = Object.values(results);
    return marksList.reduce((acc, mark) => acc + mark, 0);
}