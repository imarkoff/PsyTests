import {ReactNode, useEffect, useState} from "react";
import {Box, SwipeableDrawer} from "@mui/material";
import Puller from "@/features/dashboard/doctor/tests/components/Puller";

interface TestDrawerProps {
    children: ReactNode;
    isOpen: boolean;
    closeAction: () => void;
}

/**
 * Drawer for displaying test details on mobile devices
 * @param children
 * @param isOpen
 * @param closeAction
 * @constructor
 */
export default function TestDrawer({children, isOpen, closeAction}: TestDrawerProps) {
    const [open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(false);
        setTimeout(closeAction, 300);
    }

    useEffect(() => {
        if (isOpen) setOpen(true);
    }, [isOpen]);

    return (
        <SwipeableDrawer
            open={open}
            anchor={"bottom"}
            onOpen={() => setOpen(true)}
            onClose={onClose}
            PaperProps={{
                elevation: 2,
                sx: {
                    maxWidth: 600,
                    maxHeight: "95%",
                    marginX: "auto",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                }
            }}
        >
            <Puller />
            <Box sx={{
                height: "100%",
                overflow: "auto",
                p: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1
            }}>
                {children}
            </Box>
        </SwipeableDrawer>
    );
}