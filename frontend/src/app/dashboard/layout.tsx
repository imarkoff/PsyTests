import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import UserNavigation from "@/app/dashboard/layout/UserNavigation/UserNavigation";
import {ReactNode} from "react";

export default function DashboardLayout({children}: { children: ReactNode }) {
    return (
        <Box sx={{height: "100%", display: "flex", flexDirection: "column", overflow: "hidden"}}>
            <NavigationBar />

            <Box component={"main"} sx={{
                padding: {xs: 1.5, sm: 2, lg: 3},
                display: "flex", flexDirection: "column", gap: "1rem",
                flexGrow: 1, overflow: "auto",
            }}>
                {children}
            </Box>
        </Box>
    );
}

const NavigationBar = () => {
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