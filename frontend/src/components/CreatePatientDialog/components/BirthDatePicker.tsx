import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {Control, Controller} from "react-hook-form";
import {PatientCreateForm} from "@/types/forms/PatientCreate";
import {AdapterLuxon} from "@mui/x-date-pickers/AdapterLuxon";

export default function BirthDatePicker({control}: { control: Control<PatientCreateForm> }) {
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