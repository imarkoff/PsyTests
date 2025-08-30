import TestBase from "@/types/models/TestBase";
import {Table, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import DialogCloseButton from "@/components/DialogCloseButton";

export default function MarksDialogHeader(
    {test, onClose}: {test: TestBase, onClose: () => void}
) {
    return (
        <Table sx={{position: "sticky", top: 0}}>
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2}>
                        <Typography variant={"h6"}>
                            Система оцінювання
                            {test.marks_unit && ` (${test.marks_unit})`}
                        </Typography>
                        <Typography variant={"body2"} color={"textSecondary"}>
                            {test.name}
                        </Typography>
                    </TableCell>
                    <TableCloseButton onClose={onClose} />
                </TableRow>
            </TableHead>
        </Table>
    );
}

const TableCloseButton = ({onClose}: {onClose: () => void}) => (
    <TableCell sx={{
        position: "absolute",
        right: 35,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        padding: 0,
        border: "none"
    }}>
        <DialogCloseButton onClose={onClose} />
    </TableCell>
);