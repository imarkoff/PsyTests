import {Typography} from "@mui/material";

export default function ChooseTestPlaceholder() {
    return (
        <Typography color={"textSecondary"} sx={{
            height: "100%",
            textAlign: "center",
            display: "grid",
            placeItems: "center"
        }}>
            Оберіть тест зліва для перегляду
        </Typography>
    );
}