"use client";

import {FormProvider, useForm} from "react-hook-form";
import {Box} from "@mui/material";
import PsyTestViewer from "@/features/shared/psy-test-viewer";
import PassTestData from "../types/PassTestData";
import PassTestButton from "./PassTestButton";
import {usePassTestContext} from "../hooks/usePassTestContext";

export default function PassTestForm() {
    const {passTest, passed} = usePassTestContext();
    const methods = useForm<PassTestData>();

    return (
        <Box
            component={"form"}
            onSubmit={methods.handleSubmit(passTest)}
            sx={{display: "grid", gap: 2}}
        >
            <FormProvider {...methods}>
                <PsyTestViewer.Content disabled={passed} />
                <PsyTestViewer.ErrorAlert suggestionMessage={
                    "Якщо після перезавантаження проблема залишається, зверніться до вашого лікаря."
                }/>
                <PassTestButton />
            </FormProvider>
        </Box>
    );
}