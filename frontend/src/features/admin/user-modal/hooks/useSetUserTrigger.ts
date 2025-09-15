import useUsersTriggerContext from "./useUsersTriggerContext";
import {useEffect} from "react";

export default function useSetUserTrigger(
    trigger: (() => void) | undefined,
) {
    const { setTrigger } = useUsersTriggerContext();

    useEffect(() => {
        setTrigger(() => trigger);
    }, [trigger, setTrigger]);
}