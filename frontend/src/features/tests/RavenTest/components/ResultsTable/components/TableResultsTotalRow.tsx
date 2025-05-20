import {TableCell, TableRow} from "@mui/material";
import {RavenPointsSum} from "@/features/tests/RavenTest/utils/RavenResultsCalculator";

export default function TableResultsTotalRow(
    {longestModule, totalScore}: {longestModule: number, totalScore: RavenPointsSum}
) {
    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}>
            <TableCell sx={{borderRight: "0 !important"}} />
            <TableCell colSpan={longestModule + 1} align={"right"} sx={{fontWeight: 600}}>
                Сума: {totalScore.correct} ({totalScore.total})
            </TableCell>
        </TableRow>
    );
}