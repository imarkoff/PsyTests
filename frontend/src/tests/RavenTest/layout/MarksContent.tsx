"use client";

import RavenTest from "@/tests/RavenTest/schemas/RavenTest";
import useTestMarks from "@/components/Test/Marks/useTestMarks";
import {
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import MarksRow from "@/tests/RavenTest/components/MarksRow";
import React from "react";

export default function MarksContent({test}: {test: RavenTest}) {
    const { marks, isLoading } = useTestMarks(test.id);
    const marksLength = marks?.[0].length ?? 0;

    return (
        <>
            <TableContainer sx={{overflowX: "visible"}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow sx={{position: "relative", zIndex: 0}}>
                            <TableCell sx={{p: 1}}>
                                Бали
                            </TableCell>
                            <TableCell colSpan={marksLength - 1} align={"center"} sx={{p: 1}}>
                                Вік пацієнта
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{position: "sticky", top: 0, zIndex: 1}}>
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
                            <MarksRow key={index}>
                                {row.map((cell, index) => (
                                    <TableCell key={index}>
                                        {cell}
                                    </TableCell>
                                ))}
                            </MarksRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {isLoading && <LoadingBox />}
        </>
    );
}

const LoadingBox = () => (
    <Box sx={{height: "250px", display: "grid", placeItems: "center"}}>
        <CircularProgress />
    </Box>
);