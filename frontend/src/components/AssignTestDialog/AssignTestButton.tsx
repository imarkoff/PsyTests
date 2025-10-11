"use client";

import {Button} from "@mui/material";
import {useState} from "react";
import TestBase from "@/types/models/TestBase";
import AssignTestDialog from "./AssignTestDialog";

export default function AssignTestButton({test}: {test: TestBase}) {
    const [open, setOpen] = useState(false);
    const onOpen = () => setOpen(true);

    return (
        <>
            <Button variant={"contained"} onClick={onOpen}>
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