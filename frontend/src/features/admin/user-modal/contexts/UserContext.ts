import {createContext} from "react";
import User from "@/types/models/User";
import {ApiResponseError} from "@/lib/api-client/types";

const UserContext = createContext<{
    user: User | null;
    isLoading: boolean;
    error: ApiResponseError | null;
    changeUser: (user: User | null) => void;
}>({
    user: null,
    changeUser: () => {},
    isLoading: false,
    error: null,
});

export default UserContext;