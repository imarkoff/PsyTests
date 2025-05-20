import {TableRow} from "@mui/material";
import DarkenCell from "@/features/tests/RavenTest/components/ResultsTable/components/DarkenCell";

export default function TableResultsHeaderRow({longestModule}: {longestModule: number}) {
    return (
        <TableRow>
            <DarkenCell />
            {Array.from({length: longestModule}).map((_, i) => (
                <DarkenCell align={"center"} key={i}>{i+1}</DarkenCell>
            ))}
            <DarkenCell align={"right"}>Бали</DarkenCell>
        </TableRow>
    );
}