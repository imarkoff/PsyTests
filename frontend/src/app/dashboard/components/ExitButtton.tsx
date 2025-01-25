import {KeyedMutator} from "swr";
import User from "@/schemas/User";
import {Button} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import {logout} from "@/services/authService";

export default function ExitButton({mutate}: {mutate: KeyedMutator<User>}) {
    const onClick = async () => {
        await logout();
        await mutate(undefined);
    }

    return (
        <Button aria-label={"Вийти"} onClick={onClick} color={"error"} endIcon={<LogoutIcon />}>
            Вийти
        </Button>
    );
}