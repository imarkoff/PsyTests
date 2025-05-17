import {createContext, useContext} from "react";
import User from "@/schemas/User";
import {KeyedMutator} from "swr";

const UserContext = createContext<{
    me?: User | null,
    isLoading: boolean,
    error?: unknown,
    mutate: KeyedMutator<User | null>,
    checkPath: () => void
}>({
    isLoading: true,
    mutate: async () => undefined,
    checkPath: () => {}
});

export default UserContext;

export const useUser = () => useContext(UserContext);