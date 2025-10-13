"use client";

import {
    Alert,
    Box,
    Button,
    Card,
    FormControl,
    FormLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import PasswordInput from "@/features/login/components/PasswordInput";
import SignInContainer from "@/features/login/components/SignInContainer";
import {FormProvider, useForm} from "react-hook-form";
import UserLogin from "@/types/forms/UserLogin";
import useOnLogIn from "@/features/login/hooks/useOnLogIn";

export default function LoginForm() {
    const methods = useForm<UserLogin>();
    const { onSubmit, error, loading } = useOnLogIn();

    return (
        <SignInContainer>
            <Card
                variant={"outlined"}
                sx={formCardStyles}
            >
                <Typography variant={"subtitle2"} align={"center"} sx={{textWrap: "pretty"}}>
                    Волинська обласна психіатрична лікарня м. Луцька
                </Typography>
                <Typography component={"h1"} variant={"h4"} sx={{fontWeight: 600}} align={"center"}>Вхід</Typography>
                <FormProvider {...methods}>
                    <Box
                        component={"form"}
                        sx={{display: "flex", flexDirection: "column", gap: 2, width: "100%"}}
                        onSubmit={methods.handleSubmit(onSubmit)}
                        noValidate
                    >
                        <FormControl>
                            <FormLabel htmlFor={"phone"}>Номер телефону</FormLabel>
                            <OutlinedInput
                                id={"phone"}
                                type={"phone"}
                                placeholder={"+380998877766"}
                                fullWidth
                                size={"small"}
                                {...methods.register("phone", { required: true })}
                            />
                        </FormControl>
                        <PasswordInput />
                        <Button
                            variant={"contained"}
                            fullWidth
                            sx={{marginTop: 1}}
                            type={"submit"}
                            loading={loading}
                            loadingPosition={"end"}
                        >
                            Увійти
                        </Button>

                        {error && <Alert severity={"error"}>{error}</Alert>}
                    </Box>
                </FormProvider>
            </Card>
        </SignInContainer>
    );
}

const formCardStyles = {
    padding: 3,
    gap: 2.5,
    maxWidth: 400,
    width: "100%",
    margin: 1,
    display: "flex",
    flexDirection: "column"
}