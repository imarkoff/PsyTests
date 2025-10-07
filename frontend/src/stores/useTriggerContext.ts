import {create} from "zustand";

interface TriggerState {
    triggers: Record<string, (() => Promise<void>) | undefined>;
    addTrigger: (key: string, value: () => Promise<void>) => void;
    removeTrigger: (key: string) => void;
}

const useTriggerContext = create<TriggerState>()((set) => ({
    triggers: {},
    addTrigger: (key: string, value: () => Promise<void>) => set((state) => ({
        ...state,
        triggers: {
            ...state.triggers,
            [key]: value
        }
    })),
    removeTrigger: (key: string) => set((state) => ({
        triggers: {
            ...state.triggers,
            [key]: undefined
        }
    }))
}));

export default useTriggerContext;