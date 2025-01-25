"use client";

import {TestMarks} from "@/schemas/Test";
import {Box, Button, Popover, Typography} from "@mui/material";
import React, {useState} from "react";

export default function Marks({marks}: {marks: TestMarks}) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Box>
            <Button aria-describedby={id} onClick={handleClick}>
                Система оцінювання
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{
                    padding: ".5rem",
                    display: "flex", flexDirection: "column", gap: ".5rem"
                }}>
                    {Object.entries(marks).map(([mark, description]) => (
                        <Typography key={mark}>
                            <strong>{mark}%</strong>: {description}
                        </Typography>
                    ))}
                </Box>
            </Popover>
        </Box>
    )
}