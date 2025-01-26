import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import NavigationLayout from "@/app/dashboard/layout/NavigationLayout";
import {ReactNode} from "react";

export default function DashboardLayout({children}: { children: ReactNode }) {
    return (
        <Box>
            <AppBar position={"sticky"} color={"default"}>
                <Toolbar>
                    <Typography variant={"h5"} fontWeight={600}>
                        Тести
                    </Typography>
                    <NavigationLayout />
                </Toolbar>
            </AppBar>
            <Box sx={{
                padding: {xs: 1.5, sm: 2},
                display: "flex", flexDirection: "column", gap: "1rem",
            }}>
                {children}
            </Box>
        </Box>
    );
}