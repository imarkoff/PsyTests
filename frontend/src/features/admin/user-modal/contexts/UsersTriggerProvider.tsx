"use client";

import {PropsWithChildren, useState} from "react";
import UsersTriggerContext from "./UsersTriggerContext";

export default function UsersTriggerProvider(
    { children }: PropsWithChildren
) {
    const [trigger, setTrigger] = useState<(() => void) | undefined>(undefined);

    return (
        <UsersTriggerContext.Provider value={{ trigger, setTrigger }}>
            {children}
        </UsersTriggerContext.Provider>
    );
}