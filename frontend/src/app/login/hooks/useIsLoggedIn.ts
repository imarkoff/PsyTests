"use client";

import useSWR from "swr";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import { getMe } from "@/lib/controllers/userController";
import withSafeErrorHandling from "@/lib/fetchers/withSafeErrorHandling";

export default function useIsLoggedIn() {
    const router = useRouter();

    const { data, mutate } = useSWR("getMe", withSafeErrorHandling(getMe), {revalidateOnFocus: false});

    useEffect(() => {
        if (data) router.push("/dashboard");
    }, [data, router]);

    return {isLoggedIn: !!data, mutate};
}