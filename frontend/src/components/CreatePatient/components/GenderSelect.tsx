import { Controller, Control } from "react-hook-form";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {PatientCreateForm} from "@/schemas/PatientCreate";
import readableGender from "@/utils/getGenderFromEnum";

export default function GenderSelect({ control }: { control: Control<PatientCreateForm> }) {
    const labelId = "gender-select-label";

    return (
        <Controller
            name="gender"
            control={control}
            rules={{ required: true }}
            defaultValue={undefined}
            render={({ field, fieldState }) => (
                <FormControl
                    fullWidth
                    required
                    error={!!fieldState.error}
                >
                    <InputLabel id={labelId}>Стать</InputLabel>
                    <Select
                        labelId={labelId}
                        id="gender-select"
                        label="Стать"
                        {...field}
                        value={field.value || ""}
                    >
                        {Object.keys(readableGender).map(genderCode => (
                            <MenuItem
                                value={genderCode}
                                key={genderCode}
                            >
                                {readableGender[genderCode as keyof typeof readableGender]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        />
    );
}