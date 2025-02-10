import {Box, Fab} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import onLeaveClick from "@/app/dashboard/patient/tests/[assignedTestId]/components/onLeaveClick";
import {useTestContext} from "@/app/dashboard/patient/tests/[assignedTestId]/context/TestContext";

export default function PassTestButton() {
    const { passed } = useTestContext();

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
                <Fab
                    variant={"extended"}
                    onClick={passed ? onLeaveClick : undefined}
                    type={passed ? "button" : "submit"}
                    color={"primary"}
                >
                    {passed
                        ? <>
                            <ArrowBackIcon sx={{ mr: 1 }}/>
                            Покинути тест
                        </>
                        : <>
                            <DoneIcon sx={{ mr: 1 }}/>
                            Завершити тест
                        </>
                    }
                </Fab>
            </Box>
        </Box>
    )
}