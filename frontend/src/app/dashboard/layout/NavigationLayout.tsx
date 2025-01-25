"use client";

import useSWR from "swr";
import {getMe} from "@/services/usersService";
import {Box, Typography} from "@mui/material";
import ExitButton from "@/app/dashboard/components/ExitButtton";
import {redirect, useRouter} from "next/navigation";
import { Roles } from "@/schemas/Role";
import {useEffect} from "react";

export default function NavigationLayout() {
    const {
        data: me,
        error,
        isLoading,
        mutate
    } = useSWR(getMe.name, getMe);
    const router = useRouter();

    const notLoggedIn = !me && !isLoading && error.status === 401;

    useEffect(() => {
        if (notLoggedIn) redirect("/login");
        if (me) {
            if (me.role === Roles.patient) router.push("/dashboard/patient");
            if (me.role === Roles.doctor) router.push("/dashboard/doctor");
        }
    }, [me, notLoggedIn, router]);

    return (
        <>
            <Box sx={{display: "flex", flexGrow: 1, justifyContent: "space-between"}}>
                <Box sx={{flexGrow: 1}} />
                <Box sx={{display: "flex", alignItems: "center", gap: "1rem"}}>
                    <Typography>
                        {me?.name} {me?.surname}
                    </Typography>
                    <ExitButton mutate={mutate} />
                </Box>
            </Box>
        </>
    );
}