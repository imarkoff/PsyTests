"use client";

import {useState} from "react";
import {IconButton, Menu, MenuItem, Tooltip} from "@mui/material";
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
            >
                <EditUserDialog
                    OpenButton={({onClick, disabled}) => (
                        <MenuItem
                            onClick={onClick}
                            disabled={disabled}
                        >
                            <EditRoundedIcon sx={{mr: 1.5}}/>
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
                            <PasswordIcon sx={{mr: 1.5}}/>
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
                            <DeleteForeverIcon sx={{mr: 1.5}}/>
                            {children}
                        </MenuItem>
                    )}
                    onUserDialogClose={handleClose}
                />
            </Menu>
        </>
    );
}