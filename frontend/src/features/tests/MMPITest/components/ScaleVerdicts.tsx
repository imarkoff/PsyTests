import {MMPIVerdict} from "@/features/tests/MMPITest/schemas/MMPIResult";
import {Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";

/**
 * Show table with verdict for each scale
 * @param verdicts
 * @constructor
 */
export default function ScaleVerdicts(
    {verdicts}: { verdicts: MMPIVerdict["scale_verdicts"] | undefined }
) {
    return verdicts && (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2}>
                        <Typography fontWeight={500}>
                            Висновки
                        </Typography>
                    </TableCell>
                </TableRow>
            </TableHead>
            {Object.keys(verdicts).map(scale => (
                <TableBody key={scale}>
                    <TableRow>
                        <TableCell variant={"head"}>
                            <Typography fontWeight={500}>
                                {scale}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            {verdicts[scale].map((verdict, i) => (
                                <Typography key={i}>{verdict}</Typography>
                            ))}
                        </TableCell>
                    </TableRow>
                </TableBody>
            ))}
        </Table>
    );
}