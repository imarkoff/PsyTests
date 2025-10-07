"use client";

import {useState} from "react";
import {IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditUserDialog from "./EditUserDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

interface MoreMenuProps {
    handleClose: () => void;
}

export default function MoreMenu(
    {handleClose}: MoreMenuProps,
) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    return (
        <>
            <Tooltip title={"Дії з користувачем"}>
                <IconButton
                    aria-label="more"
                    id="user-more-button"
                    aria-controls={open ? 'user-more-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    <MoreVertIcon/>
                </IconButton>
            </Tooltip>
            <Menu
                id="user-more-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                slotProps={{
                    list: {
                        'aria-labelledby': 'user-more-button',
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{horizontal: "right", vertical: "bottom"}}
            >
                <Typography variant={"subtitle2"} gutterBottom sx={{color: "text.secondary", px: 2, py: 0.5}}>
                    Дії з користувачем
                </Typography>
                <EditUserDialog
                    OpenButton={({onClick, disabled}) => (
                        <MenuItem
                            onClick={onClick}
                            disabled={disabled}
                        >
                            <ListItemIcon>
                                <EditRoundedIcon fontSize={"small"}/>
                            </ListItemIcon>
                            Змінити дані
                        </MenuItem>
                    )}
                />
                <ChangePasswordDialog
                    OpenButton={({onClick, disabled}) => (
                        <MenuItem
                            onClick={onClick}
                            disabled={disabled}
                        >
                            <ListItemIcon>
                                <PasswordIcon fontSize={"small"}/>
                            </ListItemIcon>
                            Змінити пароль
                        </MenuItem>
                    )}
                />
                <DeleteUserDialog
                    OpenButton={({onClick, disabled, children}) => (
                        <MenuItem
                            color={"error"}
                            onClick={onClick}
                            disabled={disabled}
                            sx={{color: "error.main"}}
                        >
                            <ListItemIcon sx={{color: "error.main"}}>
                                <DeleteForeverIcon fontSize={"small"}/>
                            </ListItemIcon>
                            {children}
                        </MenuItem>
                    )}
                    onUserDialogClose={handleClose}
                />
            </Menu>
        </>
    );
}