import MMPITest from "@/features/shared/psy-test-definitions/MMPITest/schemas/MMPITest";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import MMPIScale from "@/features/shared/psy-test-definitions/MMPITest/schemas/MMPIScale";
import {ReactNode} from "react";

interface ScaleRowType {
    scale: MMPIScale;
    y: number[];
    n: number[];
}

/**
 * Marks table for MMPI test
 * @param test
 * @constructor
 */
export default function MarksTable({test}: { test: MMPITest }) {
    const questionsByScales = test.scales.map(scale => (
        {scale: scale, y: [], n: []} as ScaleRowType
    ));

    test.questions.forEach((question, index) => {
        question.answers.forEach((answer) => {
            answer.scales.forEach((scale) => {
                const row = questionsByScales.find(r => r.scale.label === scale);
                if (row) {
                    if (answer.answer) row.y.push(index + 1);
                    else row.n.push(index + 1);
                }
            })
        })
    });

    return (
        <TableContainer sx={{overflowX: "visible"}}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Шкала</TableCell>
                        <TableCell>Тип відповіді</TableCell>
                        <TableCell>№ питання</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {questionsByScales.map((row, index) => (
                        <ScaleRow
                            row={row}
                            key={index}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const ScaleRow = (
    {row}: { row: ScaleRowType }
) => {
    const {scale, y, n} = row;
    const hasBothAnswers = y.length > 0 && n.length > 0;
    const totalQuestions = y.length + n.length;

    return (
        <>
            <TableRow>
                <TableCell rowSpan={hasBothAnswers ? 2 : 1}>
                    {scale.label}
                    <Caption>{scale.name}</Caption>
                    <Caption>{totalQuestions}</Caption>
                </TableCell>
                <ScaleRowAnswers
                    {...(y.length > 0
                            ? {answers: y, type: "y"}
                            : {answers: n, type: "n"}
                    )}
                />
            </TableRow>
            {hasBothAnswers && (
                <TableRow>
                    <ScaleRowAnswers answers={n} type={"n"}/>
                </TableRow>
            )}
        </>
    );
}

const ScaleRowAnswers = (
    {answers, type}: { answers: number[], type: "y" | "n" }
) =>
    answers.length > 0 ? (
        <>
            <TableCell>
                {type === "y" ? "Так" : "Ні"}
                <Caption>{answers.length}</Caption>
            </TableCell>
            <TableCell>{answers.join(", ")}</TableCell>
        </>
    ) : null;

const Caption = ({children}: { children: ReactNode }) => (
    <Typography variant={"caption"} color={"textSecondary"}>
        &#13; - {children}
    </Typography>
);