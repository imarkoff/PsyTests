import {Box, Typography} from "@mui/material";
import User from "@/types/models/User";

interface ChangePasswordTitleProps {
    user: User | null;
}

export default function ChangePasswordTitle(
    {user}: ChangePasswordTitleProps
) {
    return (
        <Box>
            <Typography component={"h2"} variant={"h6"}>
                Зміна пароля користувача
            </Typography>
            {user && (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Для <strong>{user.surname} {user.name} {user.patronymic}</strong>
                </Typography>
            )}
        </Box>
    );
}