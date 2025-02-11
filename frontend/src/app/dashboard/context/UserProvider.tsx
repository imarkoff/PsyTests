"use client";

import {ReactNode, useCallback, useEffect} from "react";
import useSWR from "swr";
import {getMe} from "@/services/usersService";
import {redirect, useRouter} from "next/navigation";
import {Roles} from "@/schemas/Role";
import UserContext from "@/app/dashboard/context/UserContext";

export default function UserProvider({children}: { children: ReactNode }) {
    const {
        data: me,
        error,
        isLoading,
        mutate
    } = useSWR("getMe", getMe, { revalidateOnFocus: false });

    const router = useRouter();

    const notLoggedIn = !me && !isLoading && error.status === 401;

    const checkPath = useCallback(() => {
        if (notLoggedIn) redirect("/login");
        const location = window.location.pathname;
        if (me && location === "/dashboard") {
            if (me.role === Roles.patient) router.push("/dashboard/patient");
            if (me.role === Roles.doctor) router.push("/dashboard/doctor");
        }
    }, [me, notLoggedIn, router]);

    useEffect(() => {
        checkPath();
    }, [checkPath]);

    return (
        <UserContext.Provider value={{me, isLoading, error, mutate, checkPath}}>
            {children}
        </UserContext.Provider>
    );
}