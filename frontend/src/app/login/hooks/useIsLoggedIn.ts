"use client";

import useSWR from "swr";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import { getMe } from "@/lib/controllers/userController";
import SafeError from "@/lib/api-client/SafeError";

const fetchMe = async () => {
    const { data, error } = await getMe();
    if (error) throw SafeError.fromJSON(error.originalError);
    return data;
};

export default function useIsLoggedIn() {
    const router = useRouter();

    const { data, mutate } = useSWR("getMe", fetchMe, {revalidateOnFocus: false});

    useEffect(() => {
        if (data) router.push("/dashboard");
    }, [data, router]);

    return {isLoggedIn: !!data, mutate};
}