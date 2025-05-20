"use client";

import {
    Box,
    Button,
    Dialog,
    Table,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {ReactNode, useState} from "react";
import TestBase from "@/schemas/TestBase";
import DialogCloseButton from "@/components/DialogCloseButton";

/**
 * Display test marks system.
 * Shows a button which opens a dialog with marks system.
 * @param marks
 * @constructor
 */
export default function MarksDialog({test, children}: {test: TestBase, children: ReactNode}) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box>
            <Button onClick={handleOpen}>
                Система оцінювання
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={"lg"}
                fullWidth
                scroll={"paper"}
                slotProps={{ paper: {
                    sx: (theme) => ({
                        width: "100%",
                        m: 1,
                        border: "2px solid",
                        borderColor: theme.palette.divider,
                    })
                } }}
            >
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
                            <TableCloseButton onClose={handleClose}></TableCloseButton>
                        </TableRow>
                    </TableHead>
                </Table>
                <Box sx={{position: "relative", overflowY: "auto"}}>
                    {children}
                </Box>
            </Dialog>
        </Box>
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