import {Button, ButtonGroup, Tooltip} from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditUserDialog from "./EditUserDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

interface MoreMenuProps {
    handleClose: () => void;
}

export default function ActionsGroup(
    {handleClose}: MoreMenuProps,
) {
    return (
        <ButtonGroup>
            <EditUserDialog
                OpenButton={({onClick, disabled}) => (
                    <Tooltip title={"Змінити дані"}>
                        <Button
                            onClick={onClick}
                            disabled={disabled}
                        >
                            <EditRoundedIcon/>
                        </Button>
                    </Tooltip>
                )}
            />
            <ChangePasswordDialog
                OpenButton={({onClick, disabled}) => (
                    <Tooltip title={"Змінити пароль"}>
                        <Button
                            onClick={onClick}
                            disabled={disabled}
                        >
                            <PasswordIcon/>
                        </Button>
                    </Tooltip>
                )}
            />
            <DeleteUserDialog
                OpenButton={({onClick, disabled, title}) => (
                    <Tooltip title={title}>
                        <Button
                            onClick={onClick}
                            color={"error"}
                            disabled={disabled}
                        >
                            <DeleteForeverIcon/>
                        </Button>
                    </Tooltip>
                )}
                onUserDialogClose={handleClose}
            />
        </ButtonGroup>
    );
}