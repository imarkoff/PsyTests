import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import User from "@/types/models/User";

interface AssignActionsProps {
    assignError: string | undefined;
    handleAssign: () => Promise<void>;
    selectedPatient: User | undefined;
}

export default function AssignActions({assignError, handleAssign, selectedPatient}: AssignActionsProps) {
    return (
        <DialogActions sx={{flexWrap: "wrap"}}>
            {assignError && (
                <Typography
                    color={"error"}
                    variant={"body2"}
                    sx={{mr: "auto", ml: 1}}
                >
                    {assignError}
                </Typography>
            )}
            <Button autoFocus onClick={handleAssign} disabled={!selectedPatient}>
                Назначити {selectedPatient && `для ${selectedPatient.name}`}
            </Button>
        </DialogActions>
    );
}