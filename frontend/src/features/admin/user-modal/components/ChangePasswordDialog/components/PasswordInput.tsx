"use client";

import {useState} from "react";
import {IconButton, InputAdornment, TextField, TextFieldProps, Tooltip} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PasswordIcon from "@mui/icons-material/Password";

type PasswordInputProps = Omit<TextFieldProps, "type">;

export default function PasswordInput(props: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    return (
        <TextField
            type={showPassword ? "text" : "password"}
            label={"Пароль"}
            placeholder={"Введіть пароль"}
            fullWidth
            {...props}
            slotProps={{
                ...props.slotProps,
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <PasswordIcon/>
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <VisibilityButton
                                showPassword={showPassword}
                                togglePassword={togglePassword}
                            />
                        </InputAdornment>
                    ),
                    ...props.slotProps?.input
                },
            }}
        />
    );
}

const VisibilityButton = (
    {showPassword, togglePassword}: { showPassword: boolean; togglePassword: () => void }
) => (
    <Tooltip title={showPassword ? "Сховати пароль" : "Показати пароль"}>
        <IconButton onClick={togglePassword}>
            {showPassword
                ? <VisibilityOffIcon/>
                : <VisibilityIcon/>
            }
        </IconButton>
    </Tooltip>
);