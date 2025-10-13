import useTriggerContext from "@/stores/useTriggerContext";

export default function useGetTrigger(
    key: string
): ((() => Promise<void>) | (() => void)) | undefined {
    const { triggers } = useTriggerContext();
    return triggers[key];
}