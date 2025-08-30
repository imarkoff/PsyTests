import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {Control, Controller} from "react-hook-form";
import {UserCreateForm} from "@/types/forms/UserCreate";
import {AdapterLuxon} from "@mui/x-date-pickers/AdapterLuxon";

export default function BirthDatePicker({control}: { control: Control<UserCreateForm> }) {
    return (
        <Controller
            name={"birth_date"}
            control={control}
            rules={{required: true}}
            defaultValue={undefined}
            render={({ field, fieldState }) => (
                <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={"uk"}>
                    <DatePicker
                        label={"Дата народження"}
                        value={field.value || null}
                        onChange={(newValue) => {
                            field.onChange(newValue);
                        }}
                        slotProps={{
                            textField: {
                                error: !!fieldState.error,
                                required: true,
                                helperText: fieldState.error?.message
                            }
                        }}
                    />
                </LocalizationProvider>
            )}
        />
    );
}