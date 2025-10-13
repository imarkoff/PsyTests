import {TextField} from "@mui/material";
import {useFormContext} from "react-hook-form";

export default function PhoneField() {
    const { register } = useFormContext();

    return (
        <TextField
            {...register("phone", {required: true})}
            label={"Номер телефону"}
            placeholder={"+380123456789"}
            required
        />
    );
}