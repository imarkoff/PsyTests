import {Paper, Table, TableBody, TableContainer, TableHead} from "@mui/material";
import {RavenResults} from "@/features/tests/RavenTest/schemas/RavenResult";
import {
    calculatePointsByModule,
    calculateTotalScore,
    getLongestModule
} from "@/features/tests/RavenTest/utils/RavenResultsCalculator";
import { useMemo } from "react";
import TableResultsHeaderRow from "@/features/tests/RavenTest/components/ResultsTable/components/TableResultsHeaderRow";
import TableResultsAnswers from "@/features/tests/RavenTest/components/ResultsTable/components/TableResultsAnswers";
import TableResultsTotalRow from "@/features/tests/RavenTest/components/ResultsTable/components/TableResultsTotalRow";

/**
 * Table which shows passed test results for Raven test.
 * @param results
 * @constructor
 */
export default function ResultsTable({results}: {results: RavenResults}) {
    const longestModule = useMemo(() => getLongestModule(results), [results]);
    const pointsByModule = useMemo(() => calculatePointsByModule(results), [results]);
    const totalScore = useMemo(() => calculateTotalScore(pointsByModule), [pointsByModule]);

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
                    <TableResultsHeaderRow longestModule={longestModule} />
                </TableHead>

                <TableBody>
                    <TableResultsAnswers
                        results={results}
                        pointsByModule={pointsByModule}
                        longestModule={longestModule}
                    />
                    <TableResultsTotalRow
                        totalScore={totalScore}
                        longestModule={longestModule}
                    />
                </TableBody>
            </Table>
        </TableContainer>
    );
};