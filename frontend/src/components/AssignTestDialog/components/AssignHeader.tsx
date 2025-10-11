"use client";

import {Typography, Box} from "@mui/material";
import DialogCloseButton from "@/components/DialogCloseButton";
import TestBase from "@/types/models/TestBase";
import PatientsInput from "./PatientsInput";
import useTestAssignmentContext from "../hooks/useTestAssignmentContext";
import {DIALOG_TITLE_ID} from "../constants";

interface AssignHeaderProps {
    test: TestBase;
}

export default function AssignHeader(
    {test}: AssignHeaderProps
) {
    const { handleClose } = useTestAssignmentContext();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
            <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ px: 1 }}>
                    <Typography
                        component={"h2"}
                        variant={"h6"}
                        id={DIALOG_TITLE_ID}
                    >
                        Назначити тест
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {test.name}
                    </Typography>
                </Box>
                <DialogCloseButton onClose={handleClose} gutterRight={false}  />
            </Box>
            <PatientsInput />
        </Box>
    );
}