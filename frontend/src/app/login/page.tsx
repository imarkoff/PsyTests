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
import PasswordInput from "@/app/login/components/PasswordInput";
import SignInContainer from "@/app/login/components/SignInContainer";
import {FormProvider, useForm} from "react-hook-form";
import UserLogin from "@/schemas/UserLogin";
import useOnLogIn from "@/app/login/hooks/useOnLogIn";

export default function Page() {
    const methods = useForm<UserLogin>();
    const { onSubmit, error, loading } = useOnLogIn();

    return (
        <SignInContainer>
            <Card
                variant={"outlined"}
                className={"max-w-[400px] w-full box-border m-3 flex flex-col"}
                sx={{ padding: 3, gap: 3 }}
            >
                <h2>PsyTest</h2>
                <Typography component={"h1"} className={"text-4xl font-semibold"}>Вхід</Typography>
                <FormProvider {...methods}>
                    <Box
                        component={"form"}
                        className={"flex flex-col gap-5 w-full"}
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
                            className={"mt-2"}
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
