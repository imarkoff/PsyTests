import useTriggerContext from "@/stores/useTriggerContext";
import {useEffect} from "react";

export default function useSetTrigger(
    key: string,
    trigger: (() => Promise<void>) | (() => void),
) {
    const { addTrigger, removeTrigger } = useTriggerContext();

    useEffect(() => {
        addTrigger(key, trigger);

        return () => {
            removeTrigger(key);
        };
    }, [key, trigger, addTrigger, removeTrigger]);
}