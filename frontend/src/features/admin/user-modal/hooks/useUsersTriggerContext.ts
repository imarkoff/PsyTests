import {useContext} from "react";
import UsersTriggerContext from "../contexts/UsersTriggerContext";

export default function useUsersTriggerContext() {
    return useContext(UsersTriggerContext);
}