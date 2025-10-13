"use client";

import {ReactNode} from "react";
import UserContext from "../contexts/UserContext";
import useGetUserByAdminApi from "../hooks/lib/useGetUserByAdminApi";

interface UserStoreProviderProps {
    userId: string;
    children: ReactNode;
}

export default function UserProvider(
    {userId, children}: UserStoreProviderProps
) {
    const {
        user,
        isLoading,
        error,
        changeUser
    } = useGetUserByAdminApi(userId);
    
    return (
        <UserContext.Provider value={{
            user, isLoading, error, changeUser
        }}>
            {children}
        </UserContext.Provider>
    );
}