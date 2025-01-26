import {Box, Chip, Fab, Paper} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import {useTestContext} from "@/app/dashboard/patient/tests/[assignedTestId]/context/TestContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import onLeaveClick from "@/app/dashboard/patient/tests/[assignedTestId]/components/onLeaveClick";

export default function PassTestButton() {
    const { result } = useTestContext();

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
                {result && (
                    <>
                        <PaperChip
                            label={`Результат: ${result.correct_points}/${result.total_points}`}
                        />
                        {result.result && <PaperChip label={`Висновок: ${result.result}`} />}
                    </>
                )}
                <Fab
                    variant={"extended"}
                    onClick={!!result ? onLeaveClick : undefined}
                    type={result ? "button" : "submit"}
                    color={"primary"}
                >
                    {result
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

const PaperChip = ({label}: {label: string}) => (
    <Paper sx={{ borderRadius: 999 }} elevation={0}>
        <Chip label={label} />
    </Paper>
)