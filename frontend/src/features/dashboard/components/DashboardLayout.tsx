import {ReactNode} from "react";
import UserProvider from "@/features/dashboard/contexts/UserProvider";
import {Box} from "@mui/material";
import { ApiResponse } from "@/lib/api-client/types";
import User from "@/schemas/User";
import NavigationBar from "@/features/dashboard/components/NavigationBar";

export default function DashboardLayout(
    {userResponse, children}: { userResponse: ApiResponse<User>, children: ReactNode }
) {
    return (
        <UserProvider response={userResponse}>
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
        </UserProvider>
    );
}
