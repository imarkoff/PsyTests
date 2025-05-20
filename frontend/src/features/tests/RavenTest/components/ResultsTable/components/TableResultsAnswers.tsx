import {TableCell, TableRow} from "@mui/material";
import DarkenCell from "@/features/tests/RavenTest/components/ResultsTable/components/DarkenCell";
import {RavenResults, ResultsAnswer} from "@/features/tests/RavenTest/schemas/RavenResult";
import {RavenPointsSum} from "@/features/tests/RavenTest/utils/RavenResultsCalculator";

interface TableResultsAnswersProps {
    results: RavenResults;
    longestModule: number;
    pointsByModule: RavenPointsSum[];
}

export default function TableResultsAnswers(
    {results, longestModule, pointsByModule}: TableResultsAnswersProps
) {
    return Object.entries(results).map(([module, answers], i) => (
        <TableRow key={i}>
            <DarkenCell>{module}</DarkenCell>
            {answers.map((q, j) => (
                <AnswerCell key={j} answer={q}/>
            ))}
            <AlignCell colSpan={longestModule - answers.length}/>
            <DarkenCell align={"right"} sx={{fontWeight: 600}}>{pointsByModule[i].correct}</DarkenCell>
        </TableRow>
    ))
}

const AnswerCell = ({answer}: {answer: ResultsAnswer}) => {
    const {user_answer, correct_answer} = answer;
    const notCorrect = user_answer !== null && correct_answer !== user_answer;

    return (
        <TableCell align={"center"} sx={{textWrap: "nowrap"}}>
            {user_answer !== null ? user_answer+1 : ""} {notCorrect && `(${correct_answer+1})`}
        </TableCell>
    );
}

const AlignCell = ({colSpan}: {colSpan: number}) =>
    colSpan > 0 && (<TableCell colSpan={colSpan} />);
