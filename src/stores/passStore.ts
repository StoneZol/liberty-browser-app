import { create } from "zustand";

interface PassStore {
    passHash: string
    setPassHash: (passHash: string) => void
}

const usePassStore = create<PassStore>((set) => ({
    passHash: '',
    setPassHash: (passHash: string) => set({ passHash })
}))

export default usePassStore