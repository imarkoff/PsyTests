import {AppBar, Toolbar, Typography} from "@mui/material";
import UserNavigation from "@/features/dashboard/components/UserNavigation";

export default function NavigationBar() {
    return (
        <AppBar position={"sticky"} color={"default"}>
            <Toolbar sx={{gap: 3}}>
                <Typography variant={"h5"} fontWeight={600}>
                    Тести
                </Typography>
                <UserNavigation />
            </Toolbar>
        </AppBar>
    );
}