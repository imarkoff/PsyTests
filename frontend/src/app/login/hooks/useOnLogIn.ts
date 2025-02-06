import {KeyedMutator} from "swr";
import UserLogin from "@/schemas/UserLogin";
import {useState} from "react";
import {login} from "@/services/authService";
import {AxiosError} from "axios";
import User from "@/schemas/User";

export default function useOnLogIn(mutate: KeyedMutator<User>) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();

    const onSubmit = async (data: UserLogin) => {
        setError(undefined);
        setLoading(true);

        try {
            await login(data);
            await mutate();
        }
        catch (e) {
            if (e instanceof AxiosError && e.response?.status === 404) {
                setError("Невірний номер телефону або пароль");
            }
            setLoading(false);
        }
    };

    return {onSubmit, error, loading};
}