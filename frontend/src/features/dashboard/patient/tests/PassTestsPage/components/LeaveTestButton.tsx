import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Button} from "@mui/material";
import {goToPatientPage} from "@/features/dashboard/patient/tests/PassTestsPage/utils";

export default function LeaveTestButton() {
    return (
        <Button
            onClick={goToPatientPage}
            variant={"outlined"}
            startIcon={<ArrowBackIcon />}
        >
            Покинути тест
        </Button>
    );
}