import {createContext} from "react";

const UsersTriggerContext = createContext<{
    trigger: (() => void) | undefined;
    setTrigger: (trigger: () => void) => void;
}>({
    trigger: undefined,
    setTrigger: () => {},
});

export default UsersTriggerContext;