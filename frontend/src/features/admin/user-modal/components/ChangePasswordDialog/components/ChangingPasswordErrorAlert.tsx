import {Alert, AlertTitle} from "@mui/material";

interface ChangingPasswordErrorAlertProps {
    message: string;
}

export default function ChangingPasswordErrorAlert(
    {message}: ChangingPasswordErrorAlertProps
) {
    return (
        <Alert severity={"error"}>
            <AlertTitle>
                Виникла помилка при зміні пароля
            </AlertTitle>
            {message}
        </Alert>
    );
}