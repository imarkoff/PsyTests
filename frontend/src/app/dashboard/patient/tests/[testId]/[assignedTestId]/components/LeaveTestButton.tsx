import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Button} from "@mui/material";
import onLeaveClick from "@/app/dashboard/patient/tests/[testId]/[assignedTestId]/components/onLeaveClick";

export default function LeaveTestButton() {
    return (
        <Button onClick={onLeaveClick} variant={"outlined"} startIcon={<ArrowBackIcon />}>
            Покинути тест
        </Button>
    );
}