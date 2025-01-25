import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Button} from "@mui/material";
import {redirect} from "next/navigation";

export default function LeaveTestButton() {
    const onLeaveClick = () =>
        redirect("/dashboard/patient");

    return (
        <Button onClick={onLeaveClick} variant={"outlined"} startIcon={<ArrowBackIcon />}>
            Покинути тест
        </Button>
    );
}