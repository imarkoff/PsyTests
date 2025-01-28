"use client";

import User from "@/schemas/User";
import {Divider, IconButton, ListItemIcon, Menu, MenuItem} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from "react";
import {MenuNav, NavProps} from "@/app/dashboard/layout/UserNavigation/NavItem";
import {Logout} from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface NavigationMenuProps {
    user?: User;
    navMenu: NavProps[];
    onLeaveAction: () => Promise<void>;
}


// Menu for mobile devices
export default function Hamburger({user, navMenu, onLeaveAction}: NavigationMenuProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton
                sx={{display: {xs: "static", md: "none", alignSelf: "center"}}}
                onClick={handleClick}
            >
                <MenuIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 1,
                        sx: { width: 200 },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {navMenu.map((link, index) => (
                    <MenuNav key={index} {...link} />
                ))}

                <Divider />

                <MenuItem>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    {user?.name} {user?.surname && user.surname}
                </MenuItem>

                <MenuItem sx={{color: "error.main"}} onClick={onLeaveAction}>
                    <ListItemIcon>
                        <Logout fontSize="small" color={"error"} />
                    </ListItemIcon>
                    Вийти
                </MenuItem>
            </Menu>
        </>
    );
}