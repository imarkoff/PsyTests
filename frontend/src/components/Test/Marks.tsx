"use client";

import {Box, Button, Popover, Typography} from "@mui/material";
import React, {useState} from "react";
import TestBase from "@/schemas/TestBase";

/**
 * Display test marks system. Shows a button which opens a popover with marks system.
 * @param marks
 * @constructor
 */
export default function Marks({test}: {test: TestBase}) {
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
                </Box>
            </Popover>
        </Box>
    )
}