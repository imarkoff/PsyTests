"use client";

import {useState} from "react";
import {Button} from "@mui/material";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import TestBase from "@/types/models/TestBase";
import AssignTestDialog from "./AssignTestDialog";

export default function AssignTestButton({test}: {test: TestBase}) {
    const [open, setOpen] = useState(false);
    const onOpen = () => setOpen(true);

    return (
        <>
            <Button
                startIcon={<AssignmentIndIcon />}
                variant={"contained"}
                onClick={onOpen}
            >
                Назначити тест
            </Button>
            <AssignTestDialog
                test={test}
                open={open}
                setOpenAction={setOpen}
            />
        </>
    );
}