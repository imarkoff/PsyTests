"use client";

import { Box, Button, Dialog } from "@mui/material";
import {ReactNode, useState} from "react";
import TestBase from "@/types/models/TestBase";
import MarksDialogHeader from "@/components/MarksDialog/MarksDialogHeader";

/**
 * Display test marks system.
 * Shows a box with a button and hidden marks dialog
 * which shows on button click.
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
                <MarksDialogHeader test={test} onClose={handleClose} />
                <Box sx={{position: "relative", overflowY: "auto"}}>
                    {children}
                </Box>
            </Dialog>
        </Box>
    );
}