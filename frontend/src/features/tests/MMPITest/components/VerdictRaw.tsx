import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {MMPIVerdict} from "@/features/tests/MMPITest/schemas/MMPIResult";

export default function VerdictRaw(
    {raw = {}}: { raw: MMPIVerdict["raw"] | undefined }
) {
    return (
        <TableContainer sx={{border: 1, borderColor: 'divider', borderRadius: 3, minHeight: 145}}>
            <Typography
                variant={"body1"}
                fontWeight={500}
                sx={{p: 1.5, backgroundColor: 'background.paper', width: "100%"}}
            >
                Сирі результати
            </Typography>
            <Table sx={{...cellsStyles}}>
                <TableHead sx={{backgroundColor: 'background.paper'}}>
                    <TableRow>
                        {Object.keys(raw).map((key) => (
                            <TableCell key={key} sx={{p: 1.5}} align={"center"}>{key}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow sx={{"& td": {borderBottom: 0}}}>
                        {Object.values(raw).map((value, index) => (
                            <TableCell key={index} sx={{p: 1.5}} align={"center"}>{value}</TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const cellsStyles = {
    "& th, & td": {
        borderTop: "1px solid",
        borderColor: 'divider'
    },
    "& td:not(:last-child), & th:not(:last-child)": {
        borderRight: "1px solid",
        borderColor: 'divider'
    }
}