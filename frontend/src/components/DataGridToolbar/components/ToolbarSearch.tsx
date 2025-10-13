import {QuickFilter, QuickFilterClear, QuickFilterControl} from "@mui/x-data-grid";
import {InputAdornment, SxProps, TextField, Theme} from "@mui/material";
import {Cancel as CancelIcon, Search as SearchIcon} from "@mui/icons-material";

interface ToolbarDividerProps {
    placeholder?: string;
    sx?: SxProps<Theme>;
}

export default function ToolbarDivider(
    {placeholder = "Швидкий пошук...", sx}: ToolbarDividerProps
) {
    return (
        <QuickFilter>
            <QuickFilterControl
                render={({ref, ...controlProps}, state) => (
                    <TextField
                        {...controlProps}
                        inputRef={ref}
                        aria-label="Пошук"
                        placeholder={placeholder}
                        fullWidth
                        size="small"
                        sx={sx}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small"/>
                                    </InputAdornment>
                                ),
                                endAdornment: state.value ? (
                                    <InputAdornment position="end">
                                        <QuickFilterClear
                                            edge="end"
                                            size="small"
                                            aria-label="Очистити пошук"
                                            material={{sx: {marginRight: -0.75}}}
                                        >
                                            <CancelIcon fontSize="small"/>
                                        </QuickFilterClear>
                                    </InputAdornment>
                                ) : null,
                                ...controlProps.slotProps?.input,
                            },
                            ...controlProps.slotProps,
                        }}
                    />
                )}
            />
        </QuickFilter>
    );
}