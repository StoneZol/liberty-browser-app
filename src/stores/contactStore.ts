import { create } from "zustand";

export interface ContactRef {
    id: string;
    configHash: string;
}

interface ContactStoreState {
    refs: ContactRef[];
    setRefs: (refs: ContactRef[]) => void;
    upsertRef: (ref: ContactRef) => void;
    removeRef: (id: string) => void;
}

const useContactStore = create<ContactStoreState>((set) => (

    {
        refs: [],
        setRefs: (refs) => set({ refs }),
        upsertRef: (ref) =>
            set((state) => {
                const existingIndex = state.refs.findIndex((r) => r.id === ref.id);
                if (existingIndex === -1) {
                    return { refs: [...state.refs, ref] };
                }
                const next = [...state.refs];
                next[existingIndex] = ref;
                return { refs: next };
            }),
        removeRef: (id) =>
            set((state) => ({
                refs: state.refs.filter((r) => r.id !== id),
            })),
    }));

export default useContactStore;
