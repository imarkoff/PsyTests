import useSWR from "swr";
import {getMe} from "@/services/usersService";
import {redirect, useRouter} from "next/navigation";
import {useEffect} from "react";
import {Roles} from "@/schemas/Role";

export default function useUser() {
    const {
        data: me,
        error,
        isLoading,
        mutate
    } = useSWR("getMe", getMe);

    const router = useRouter();

    const notLoggedIn = !me && !isLoading && error.status === 401;

    useEffect(() => {
        if (notLoggedIn) redirect("/login");
        const location = window.location.pathname;
        if (me && location === "/dashboard") {
            if (me.role === Roles.patient) router.push("/dashboard/patient");
            if (me.role === Roles.doctor) router.push("/dashboard/doctor");
        }
    }, [me, notLoggedIn, router]);

    return {me, isLoading, error, mutate};
}