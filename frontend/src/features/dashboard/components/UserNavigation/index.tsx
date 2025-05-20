"use client";

import {Box, Button, Typography} from "@mui/material";
import Hamburger from "@/features/dashboard/components/UserNavigation/components/Hamburger";
import NavigationItem from "@/features/dashboard/components/UserNavigation/components/NavigationItem";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {useUser} from "@/features/dashboard/contexts/UserContext";
import getNavMenu from "@/features/dashboard/components/UserNavigation/utils/getNavMenu";

export default function UserNavigation() {
    const { me, onLogOut } = useUser();
    const navMenu = getNavMenu(me?.role);

    return (
        <>
            <Box sx={{
                display: "flex", 
                alignSelf: "stretch", 
                flexGrow: 1, 
                justifyContent: {xs: "end", md: "space-between"}
            }}>
                <Box sx={{display: {xs: "none", md: "flex"}, flexGrow: 1}}>
                    {navMenu.map((link, index) => (
                        <NavigationItem {...link} key={index} />
                    ))}
                </Box>

                <Box sx={{display: {xs: "none", md: "flex"}, alignItems: "center", gap: 2}}>
                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                        <AccountCircleIcon fontSize="small" />
                        <Typography>
                            {me?.name} {me?.surname}
                        </Typography>
                    </Box>

                    <Button aria-label={"Вийти"} onClick={onLogOut} color={"error"} endIcon={<LogoutIcon />}>
                        Вийти
                    </Button>
                </Box>
                
                <Hamburger user={me} navMenu={navMenu} onLeaveAction={onLogOut} />
            </Box>
        </>
    );
}