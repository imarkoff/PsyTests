import {ChangeEvent, RefObject} from "react";
import {CircularProgress, InputAdornment, OutlinedInput} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface FindInputProps {
    searchRef: RefObject<HTMLInputElement | null>;
    loading: boolean;
    setQuery: (query: string) => void;
}

export default function FindInput({searchRef, setQuery, loading}: FindInputProps) {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }

    return (
        <OutlinedInput
            inputRef={searchRef}
            onChange={handleInputChange}
            placeholder={"Введіть ініціали пацієнта або його номер"}
            startAdornment={
                <InputAdornment position={"start"}>
                    <SearchIcon />
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position={"end"}>
                    <CircularProgress size={24} sx={{ visibility: loading ? "visible" : "collapse" }} />
                </InputAdornment>
            }
            sx={{
                fontSize: "1.25rem",
                fontWeight: 500,
                flexGrow: 1,
            }}
        />
    );
}