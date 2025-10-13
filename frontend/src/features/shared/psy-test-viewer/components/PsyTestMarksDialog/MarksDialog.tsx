"use client";

import {useState} from "react";
import {Box, Dialog} from "@mui/material";
import usePsyTestContext from "@/features/shared/psy-test-viewer/hooks/usePsyTestContext";
import MarksDialogHeader from "./components/MarksDialogHeader";
import DialogOpener from "./components/DialogOpener";
import PsyTestViewer from "@/features/shared/psy-test-viewer";

export default function MarksDialog() {
    const {test} = usePsyTestContext();

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box>
            <DialogOpener onClick={handleOpen}/>
            {test && (
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth={"lg"}
                    fullWidth
                    scroll={"paper"}
                >
                    <MarksDialogHeader test={test} onClose={handleClose}/>
                    <Box sx={{position: "relative", overflowY: "auto"}}>
                        <PsyTestViewer.Marks/>
                    </Box>
                </Dialog>
            )}
        </Box>
    );
}