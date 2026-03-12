import { create } from "zustand";

export type screenType = 'reg' | 'login' | 'settings' | 'main' | 'about' | 'create_contact' | 'edit_contact'

interface ScreenStore {
    screen: screenType;
    setScreen: (screen: screenType) => void;
}

const useScreenStore = create<ScreenStore>((set) => ({
    screen: 'reg',
    setScreen: (screen: screenType) => set({ screen })
}));

export default useScreenStore;