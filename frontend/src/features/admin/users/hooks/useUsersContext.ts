import {useContext} from "react";
import {OutOfReactContextError} from "@/errors";
import UsersContext from "../contexts/UsersContext";
import UserEntityConfig from "../types/UserEntityConfig";

export default function useUsersContext(): UserEntityConfig {
    const methods = useContext(UsersContext);

    if (!methods) {
        throw new OutOfReactContextError("useUsersContext is used outside of UsersContext.Provider");
    }

    return methods;
}