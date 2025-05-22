import {Button, CardActions} from "@mui/material";

interface AssignedTestCardActionsProps {
    onDelete?: () => void;
    onStart?: () => void;
}

export default function AssignedTestCardActions({onDelete, onStart}: AssignedTestCardActionsProps) {
    return (
        <CardActions sx={{justifyContent: "space-between"}}>
            {onDelete && (
                <Button variant="outlined" color="error" onClick={onDelete}>
                    Забрати доступ
                </Button>
            )}
            {onStart && (
                <Button variant="contained" color="primary" onClick={onStart}>
                    Почати тест
                </Button>
            )}
        </CardActions>
    );
}