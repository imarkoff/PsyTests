"use client";

import {useRouter} from "next/navigation";
import {Button} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton() {
    const router = useRouter();
    const onClick = () => router.back();

    return (
        <Button
            onClick={onClick}
            variant={"outlined"}
            sx={{justifySelf: "start"}}
            startIcon={<ArrowBackIcon />}
        >
            Назад
        </Button>
    );
}