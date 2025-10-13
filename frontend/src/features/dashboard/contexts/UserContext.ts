import {createContext, useContext} from "react";
import User from "@/types/models/User";

const UserContext = createContext<{
    me?: User | null,
    onLogOut: () => Promise<void>,
}>({
    onLogOut: async () => {}
});

export default UserContext;

export const useUser = () => useContext(UserContext);