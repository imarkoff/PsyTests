import useTriggerContext from "@/stores/useTriggerContext";
import {useEffect} from "react";

export default function useSetTrigger(
    key: string,
    trigger: () => void
) {
    const { addTrigger, removeTrigger } = useTriggerContext();

    useEffect(() => {
        addTrigger(key, trigger);

        return () => {
            removeTrigger(key);
        };
    }, [key, trigger, addTrigger, removeTrigger]);
}