import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {Controller} from "react-hook-form";
import {AdapterLuxon} from "@mui/x-date-pickers/AdapterLuxon";

export default function BirthDatePicker() {
    return (
        <Controller
            name={"birth_date"}
            rules={{required: true}}
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