import {Alert} from "@mui/material";

export default function PreviousPasswordWillBecomeInvalidAlert() {
    return (
        <Alert severity={"warning"} sx={{ maxWidth: 325 }}>
            Після зміни пароля, попередній пароль буде недійсний.
        </Alert>
    );
}