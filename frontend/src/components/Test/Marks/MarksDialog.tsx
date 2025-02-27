"use client";

import {
    Box,
    Button, CircularProgress,
    Dialog,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import useTestMarks from "@/components/Test/Marks/useTestMarks";
import TestBase from "@/schemas/TestBase";
import DialogCloseButton from "@/components/DialogCloseButton";

/**
 * Display test marks system.
 * Shows a button which opens a dialog with marks system.
 * @param marks
 * @constructor
 */
export default function MarksDialog({test}: {test: TestBase}) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { marks, isLoading } = useTestMarks(test.id);
    const marksLength = marks?.[0].length ?? 0;

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
                slotProps={{ paper: { sx: { width: "100%", m: 1 } } }}
            >
                <TableContainer sx={{maxHeight: "100%"}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow sx={{position: "sticky", top: 0, zIndex: 1}}>
                                <TableCell colSpan={marksLength+2}>
                                    <Typography variant={"h6"}>
                                        Система оцінювання
                                    </Typography>
                                    <Typography variant={"body2"} color={"textSecondary"}>
                                        {test.name}
                                    </Typography>
                                </TableCell>
                                <TableCloseButton onClose={handleClose}></TableCloseButton>
                            </TableRow>
                            <TableRow sx={{position: "relative", zIndex: 0}}>
                                <TableCell sx={{p: 1}}>
                                    Бали
                                </TableCell>
                                <TableCell colSpan={marksLength - 1} align={"center"} sx={{p: 1}}>
                                    Вік пацієнта
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{position: "sticky", top: 85, zIndex: 1}}>
                                {marks?.[0].map((header, index) => (
                                    <TableCell key={index}>
                                        {header}
                                        {marksLength-1 === index && "+"}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {marks?.slice(1).map((row, index) => (
                                <TableRow key={index} hover>
                                    {row.map((cell, index) => (
                                        <TableCell
                                            key={index}
                                            variant={index === 0 ? "head" : undefined}
                                            sx={{zIndex: 0}}
                                        >
                                            {cell}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {isLoading && <LoadingBox />}
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

const LoadingBox = () => (
    <Box sx={{height: "250px", display: "grid", placeItems: "center"}}>
        <CircularProgress />
    </Box>
);