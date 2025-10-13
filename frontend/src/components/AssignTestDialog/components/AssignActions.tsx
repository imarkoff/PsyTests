"use client";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import {Alert, Box} from "@mui/material";
import useTestAssignmentContext from "../hooks/contexts/useTestAssignmentContext";
import PatientsPagination from "./PatientsPagination";

export default function AssignActions() {
    const {handleAssign, isMutating, error, selectedPatient} = useTestAssignmentContext();

    return (
        <DialogActions sx={{flexDirection: "column", gap: 1}}>
            {error && (
                <Alert severity={"error"} sx={{width: "100%"}}>
                    {error.statusText}
                </Alert>
            )}
            <Box sx={{width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <PatientsPagination/>
                <Button
                    autoFocus
                    onClick={handleAssign}
                    loading={isMutating}
                    disabled={!selectedPatient}
                >
                    Назначити {selectedPatient && `для ${selectedPatient.name}`}
                </Button>
            </Box>
        </DialogActions>
    );
}