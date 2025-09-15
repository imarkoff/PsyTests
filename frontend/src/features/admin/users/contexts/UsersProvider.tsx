"use client";

import {ReactNode} from "react";
import UserEntityConfig from "../types/UserEntityConfig";
import UsersContext from "./UsersContext";

interface UsersProviderProps {
    config: UserEntityConfig;
    children: ReactNode;
}

export default function UsersProvider(
    {config, children}: UsersProviderProps
) {
    return (
        <UsersContext.Provider value={config}>
            {children}
        </UsersContext.Provider>
    );
}