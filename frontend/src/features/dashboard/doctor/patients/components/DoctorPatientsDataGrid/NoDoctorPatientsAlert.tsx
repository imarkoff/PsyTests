import {Box, Alert, AlertTitle} from "@mui/material";
import {ApiResponseError} from "@/lib/api-client/types";

interface NoDoctorPatientsAlertProps {
    error?: ApiResponseError;
}

export default function NoDoctorPatientsAlert(
    {error}: NoDoctorPatientsAlertProps
) {
    return (
        <Box sx={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
            {error ? (
                <Alert
                    color={"error"}
                >
                    <AlertTitle>
                        Сталася помилка при отриманні пацієнтів
                    </AlertTitle>
                    {error.statusText}
                </Alert>
            ) : (
                "У вас немає пацієнтів на вашому обліку"
            )}
        </Box>
    );
}