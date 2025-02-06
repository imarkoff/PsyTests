import useSWR from "swr";
import {getMe} from "@/services/usersService";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function useIsLoggedIn() {
    const router = useRouter();

    const { data, mutate } = useSWR(getMe.name, getMe, {revalidateOnFocus: false});

    useEffect(() => {
        if (data) router.push("/dashboard");
    }, [data, router]);

    return {isLoggedIn: !!data, mutate};
}