import {Alert, AlertTitle} from "@mui/material";

export default function GettingUsersErrorOverlayAlert(
    {error}: { error: string }
) {
    return (
        <Alert
            severity={"error"}
            sx={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}
        >
            <AlertTitle>Сталася помилка під час завантаження даних</AlertTitle>
            {error}
        </Alert>
    );
}