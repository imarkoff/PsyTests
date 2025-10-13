import {TextField} from "@mui/material";
import {useFormContext} from "react-hook-form";

export default function PasswordField() {
    const { register } = useFormContext();

    return (
        <TextField
            {...register("password", {required: true})}
            label={"Пароль"}
            type={"password"}
            required
        />
    );
}