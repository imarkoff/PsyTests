"use client";

import {PropsWithChildren} from "react";
import ActionDialogContext from "./ActionDialogContext";

interface ActionDialogProviderProps extends PropsWithChildren {
    onClose: () => void;
}

export default function ActionDialogProvider(
    {onClose, children}: ActionDialogProviderProps
) {
    return (
        <ActionDialogContext.Provider value={{onClose}}>
            {children}
        </ActionDialogContext.Provider>
    );
}