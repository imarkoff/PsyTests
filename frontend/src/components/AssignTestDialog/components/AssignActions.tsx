"use client";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import {Alert, Box, Pagination} from "@mui/material";
import useDoctorPatientsContext from "../hooks/useDoctorPatientsContext";
import useTestAssignmentContext from "../hooks/useTestAssignmentContext";

export default function AssignActions() {
    const {paginatedPatients} = useDoctorPatientsContext();
    const {handleAssign, isMutating, error, selectedPatient} = useTestAssignmentContext();

    return (
        <DialogActions sx={{flexDirection: "column", gap: 1}}>
            {error && (
                <Alert severity={"error"} sx={{width: "100%"}}>
                    {error.statusText}
                </Alert>
            )}
            <Box sx={{width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <Pagination
                    count={paginatedPatients?.total_pages}
                    page={paginatedPatients ? paginatedPatients.offset + 1 : 1}
                    color={"primary"}
                    variant={"outlined"}
                />
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