"use client";

import {ReactNode} from "react";
import UserContext from "@/app/dashboard/context/UserContext";
import User from "@/schemas/User";
import { logOut } from "@/lib/controllers/authController";
import { useRouter } from "next/navigation";
import {ApiResponse} from "@/lib/api-client/types";

export default function UserProvider(
    {response, children}: { response: ApiResponse<User>, children: ReactNode }
) {
    const { data: me } = response;

    const router = useRouter();
    const onLogOut = async () => {
        const {data} = await logOut();
        if (data) router.push(data.redirectTo);
    }

    return (
        <UserContext.Provider value={{me, onLogOut}}>
            {children}
        </UserContext.Provider>
    );
}