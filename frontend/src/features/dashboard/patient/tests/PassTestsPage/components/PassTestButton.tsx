import {Box, Button} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {goToPatientPage} from "@/features/dashboard/patient/tests/PassTestsPage/utils";
import {usePassTestContext} from "@/features/dashboard/patient/tests/PassTestsPage/hooks/usePassTestContext";
import {usePsyTestContext} from "@/features/shared/psy-test-viewer";

export default function PassTestButton() {
    const {isLoading: isTestLoading, error} = usePsyTestContext();
    const { passed, loading } = usePassTestContext();

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
                    onClick={passed ? goToPatientPage : undefined}
                    type={passed ? "button" : "submit"}
                    color={"primary"}
                    loading={isTestLoading || loading}
                    disabled={!!error}
                    startIcon={passed ? <ArrowBackIcon/> : <DoneIcon/>}
                    loadingPosition={"start"}
                >
                    {passed ? "Покинути тест" : "Завершити тест"}
                </Button>
            </Box>
        </Box>
    )
}