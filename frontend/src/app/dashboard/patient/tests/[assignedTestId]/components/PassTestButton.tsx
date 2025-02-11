import {Box, Button} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import onLeaveClick from "@/app/dashboard/patient/tests/[assignedTestId]/components/onLeaveClick";
import {useTestContext} from "@/app/dashboard/patient/tests/[assignedTestId]/context/TestContext";

export default function PassTestButton() {
    const { passed, loading } = useTestContext();

    return (
        <Box sx={{height: 60}}>
            <Box sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                display: "grid",
                gap: 1,
                justifyItems: "end",
            }}>
                <Button
                    variant={"contained"}
                    sx={{py: 1.5, borderRadius: "999px", textTransform: "uppercase"}}
                    onClick={passed ? onLeaveClick : undefined}
                    type={passed ? "button" : "submit"}
                    color={"primary"}
                    loading={loading}
                    startIcon={passed ? <ArrowBackIcon/> : <DoneIcon/>}
                    loadingPosition={"start"}
                >
                    {passed ? "Покинути тест" : "Завершити тест"}
                </Button>
            </Box>
        </Box>
    )
}