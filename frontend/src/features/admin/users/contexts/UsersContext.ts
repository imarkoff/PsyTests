import {createContext} from "react";
import UserEntityConfig from "../types/UserEntityConfig";

const UsersContext = createContext<UserEntityConfig | undefined>(undefined);

export default UsersContext;