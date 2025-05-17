"use client";

import UserLogin from "@/schemas/UserLogin";
import {useCallback, useState} from "react";
import {logIn} from "@/lib/controllers/authController";
import { useRouter } from "next/navigation";

const fetchLogIn = (userLogin: UserLogin) => logIn(userLogin);

export default function useOnLogIn() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const router = useRouter();

    const onSubmit = useCallback(async (userLogin: UserLogin) => {
        setError(undefined);
        setLoading(true);

        const {data, error} = await fetchLogIn(userLogin);

        if (!error) {
            if (data) router.replace(data.redirectTo);
        } else {
            if (error.status === 404) {
                setError("Невірний номер телефону або пароль");
            } else {
                setError(error.statusText);
            }
            setLoading(false);
        }
    }, [router]);

    return {onSubmit, error, loading};
}