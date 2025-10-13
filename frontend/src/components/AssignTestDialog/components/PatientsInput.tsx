"use client";

import {useEffect, useState} from "react";
import {CircularProgress, InputAdornment, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from "@/hooks/useDebounce";
import useDoctorPatientsContext from "../hooks/contexts/useDoctorPatientsContext";
import PaginationLogicalOperator from "@/types/enums/PaginationLogicalOperator";

export default function PatientsInput() {
    const {
        paginationHandlers: {handleQuickFilterChange},
        isLoading
    } = useDoctorPatientsContext();

    const [input, setInput] = useState("");
    const debouncedInput = useDebounce(input, 300);

    useEffect(() => {
        handleQuickFilterChange(
            debouncedInput.split(" "),
            PaginationLogicalOperator.AND
        )
    }, [debouncedInput, handleQuickFilterChange]);

    return (
        <TextField
            placeholder={"Введіть ПІБ або номер телефону пацієнта"}
            onChange={(e) => setInput(e.target.value)}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position={"start"}>
                            <SearchIcon/>
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position={"end"}>
                            {isLoading && (
                                <CircularProgress aria-label={"Отримання пацієнтів"} />
                            )}
                        </InputAdornment>
                    )
                }
            }}
            fullWidth
        />
    );
}