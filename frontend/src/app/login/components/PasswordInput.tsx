"use client";

import {useState} from "react";
import {FormControl, FormLabel, IconButton, OutlinedInput} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useFormContext} from "react-hook-form";

export default function PasswordInput() {
    const {register} = useFormContext();
    const [passVisibility, setPassVisibility] = useState(false);

    return (
        <FormControl fullWidth>
            <FormLabel htmlFor={"password"}>Пароль</FormLabel>
            <OutlinedInput
                id={"password"}
                type={passVisibility ? "text" : "password"}
                placeholder={"пароль123"}
                error={false} // TODO: add error state
                fullWidth
                size={"small"}
                {...register("password", { required: true })}
                endAdornment={
                    <IconButton
                        onClick={() => setPassVisibility(!passVisibility)}
                        className={"items-center"}
                    >
                        {passVisibility ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                }
            />
        </FormControl>
    );
}
