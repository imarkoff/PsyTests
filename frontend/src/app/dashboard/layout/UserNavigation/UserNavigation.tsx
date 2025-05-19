"use client";

import {Box, Button, Typography} from "@mui/material";
import {Role, Roles} from "@/schemas/Role";
import Hamburger from "@/app/dashboard/layout/UserNavigation/Hamburger";
import doctorNav from "@/app/dashboard/doctor/doctorNav";
import NavItem from "@/app/dashboard/layout/UserNavigation/NavItem";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {useUser} from "@/app/dashboard/context/UserContext";

export default function UserNavigation() {
    const { me, onLogOut } = useUser();

    const getNavMenu = (role?: Role) => {
        switch (role) {
            case Roles.doctor:
                return doctorNav;
            // case Roles.patient:
            //     return patientNav;
            default:
                return [];
        }
    };

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
                        <NavItem {...link} key={index} />
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