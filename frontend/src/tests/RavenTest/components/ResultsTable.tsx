import styled from "@emotion/styled";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme} from "@mui/material";
import {Results, ResultsAnswer} from "@/tests/RavenTest/schemas/RavenResult";

interface Sum { correct: number; total: number; }

/**
 * Table with test results
 * @param results
 * @constructor
 */
export default function ResultsTable({results}: {results: Results}) {
    const longestModule = Math.max(...Object.values(results).map(answers => answers.length));

    const pointsByModule: Sum[] = Object.values(results).map(answers => answers.reduce(
        (acc, q) => ({
            correct: acc.correct + (q.user_answer === q.correct_answer ? q.points : 0),
            total: acc.total + q.points
        })
    , {correct: 0, total: 0}));

    const sum: Sum = pointsByModule.reduce((acc, {correct, total}) => ({
        correct: acc.correct + correct,
        total: acc.total + total
    }), {correct: 0, total: 0});

    return (
        <TableContainer component={Paper} sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
        }}>
            <Table sx={{
                "& th, & td": { borderColor: "divider" },
                "& th:not(:last-child), & td:not(:last-child)": { borderRight: "1px solid", borderColor: "divider" }
            }}>
                <TableHead sx={{ backgroundColor: "paper.main"}}>
                    <TableRow>
                        <DarkenCell></DarkenCell>
                        {Array.from({length: longestModule}).map((_, i) => (
                            <DarkenCell align={"center"} key={i}>{i+1}</DarkenCell>
                        ))}
                        <DarkenCell align={"right"}>Бали</DarkenCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {Object.entries(results).map(([module, answers], i) => (
                        <TableRow key={i}>
                            <DarkenCell>{module}</DarkenCell>
                            {answers.map((q, j) => (
                                <AnswerCell key={j} answer={q} />
                            ))}
                            <AlignCell colSpan={longestModule - answers.length} />
                            <DarkenCell align={"right"} sx={{fontWeight: 600}}>{pointsByModule[i].correct}</DarkenCell>
                        </TableRow>
                    ))}

                    <TableRow sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}>
                        <TableCell sx={{borderRight: "0 !important"}} />
                        <TableCell colSpan={longestModule + 1} align={"right"} sx={{fontWeight: 600}}>
                            Сума: {sum.correct} ({sum.total})
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

/**
 * Cell with an answer
 * @param answer
 * @constructor
 */
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

const DarkenCell= styled(TableCell)(({theme}: {theme?: Theme}) => ({
    backgroundColor: theme!.palette.background.paper
}));