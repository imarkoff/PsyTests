import {FormProvider, UseFormReturn} from "react-hook-form";
import {Box} from "@mui/material";
import {PropsWithChildren} from "react";

interface UserFormRootProps<TFormEntity extends object> extends PropsWithChildren {
    methods: UseFormReturn<TFormEntity>;
    injectedFormSubmit: () => void;
}

export default function UserFormRoot<TFormEntity extends object>(
    {injectedFormSubmit, methods, children}: UserFormRootProps<TFormEntity>
) {
    return (
        <form onSubmit={injectedFormSubmit} noValidate>
            <FormProvider {...methods}>
                <Box sx={{padding: 1, display: "grid", gap: 1, width: {xs: "100%", md: 350}}}>
                    {children}
                </Box>
            </FormProvider>
        </form>
    );
}